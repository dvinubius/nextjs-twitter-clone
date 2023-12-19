import { PrismaClient } from "@prisma/client";

function deleteDB() {
  const prisma = new PrismaClient();
  const proms = [
    prisma.$executeRaw`DROP table IF EXISTS "Tweet" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "Echo" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "Like" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "User" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "Account" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "Session" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "VerificationToken" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "_Followers" cascade;`,
    prisma.$executeRaw`DROP table IF EXISTS "_prisma_migrations" cascade;`,
  ];
  Promise.all(proms)
    .then(() => console.log('Dropped all tables'))
    .catch((e) => {
      console.log(e);
    }).finally(() => {
      void prisma.$disconnect();
    });
}

deleteDB();

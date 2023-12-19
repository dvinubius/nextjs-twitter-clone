import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          createdAt: true,
          name: true,
          image: true,
          bio: true,
          handle: true,
          banner: true,
          _count: { select: { followers: true, follows: true, tweets: true } },
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
        },
      });

      if (profile == null) return;

      return {
        joined: profile.createdAt,
        name: profile.name,
        image: profile.image,
        bio: profile.bio,
        handle: profile.handle,
        banner: profile.banner,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        tweetsCount: profile._count.tweets,
        isFollowing: profile.followers.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const existingFollow = await ctx.prisma.user.findFirst({
        where: { id: userId, followers: { some: { id: currentUserId } } },
      });

      let addedFollow;
      if (existingFollow == null) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      void ctx.revalidateSSG?.(`/profiles/${userId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);

      return { addedFollow };
    }),
  update: protectedProcedure
    .input(z.object({ 
      userId: z.string(), 
      bio: z.string(),
      name: z.string(),
      handle: z.string(),
      image: z.string(),
      banner: z.string(),
    }))
    .mutation(async ({input: {userId, bio, name, handle, image, banner}, ctx}) => {
      const currentUserId = ctx.session.user.id;

      if (currentUserId != userId) {
        throw new Error("User id mismatch");
      }

      const userByHandle = await ctx.prisma.user.findFirst({
        where: { handle },
      });
      if (userByHandle != null && userByHandle.id != userId) {
        throw new Error("Handle already taken");
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: { bio, name, handle, image, banner },
      });

      void ctx.revalidateSSG?.(`/profiles/${userId}`);

      return updatedUser;
    })
});

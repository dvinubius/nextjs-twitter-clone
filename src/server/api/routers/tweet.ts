import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { MAX_TWEET_LENGTH } from "~/config/constants";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  type createTRPCContext,
} from "~/server/api/trpc";
import type { CreatedReplyTweet, ParentTweet, Tweet } from "~/types/tweet.type";
import { PARENT_TWEET_FIELDS } from "~/types/tweet.type";

export const ECHOES_LIMIT = 42; // reasonable for a small app
// (a user should be able to find out who of their followed users echoed a recently echoed tweet)

export const tweetRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        // @ts-ignore
        select: tweetSelect(currentUserId),
      });

      if (tweet == null) return;

      return tweetReturn(tweet, currentUserId);
    }),
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), lastPostedAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { 
          OR: [
            { userId }, // tweets by user
            { echoes: { some: {userId} } } // tweets echoed by user
          ]
        },
      });
    }),
  infiniteLikedFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), lastPostedAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { likes: { some: { userId } } },
      });
    }),
  infiniteEchoedFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), lastPostedAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { echoes: { some: { userId } } },
      });
    }),
  infiniteReplyFeed: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), lastPostedAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, tweetId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { replyParentId: tweetId },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), lastPostedAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteTweets({
          limit,
          ctx,
          cursor,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  OR: [
                    {
                      user: {
                        followers: { some: { id: currentUserId } }, // tweets by users followed by current user
                      },
                    },
                    // tweets echoed by users followed by current user
                    {
                      echoes: {
                        some: {
                          user: {
                            followers: { some: { id: currentUserId } },
                          },
                        },
                      },
                    }
                  ]
                },
        });
      }
    ),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id },
      });

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);

      return tweet;
    }
  ),
  echo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };

      const existingEcho = await ctx.prisma.echo.findUnique({
        where: { userId_tweetId: data },
      });

      if (!!existingEcho) {
        throw new Error("Echo already exists");
      }

      const parentTweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });
      if (!parentTweet) {
        throw new Error("Parent tweet not found");
      }

      await ctx.prisma.echo.create({ data });
      await ctx.prisma.tweet.update({
        where: { id },
        data: { lastPostedAt: new Date() },
      });

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);
      void ctx.revalidateSSG?.(`/profiles/${parentTweet.userId}`);
      void ctx.revalidateSSG?.(`/tweets/${parentTweet.id}`);
  
      return { addedEcho: true };      
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
  reply: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string().max(MAX_TWEET_LENGTH) }))
    .mutation(async ({ input: { id, content }, ctx }) => {
      const parentTweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        // @ts-ignore
        select: tweetSelect(ctx.session.user.id)
      });
      if (!parentTweet) {
        throw new Error("Parent tweet not found");
      }

      const tweet = await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id, replyParentId: id },
      });

      const tweetWithRelations = await ctx.prisma.tweet.findUnique({
        where: { id: tweet.id },
        // @ts-ignore
        select: tweetSelect(ctx.session.user.id)
      });

      if (!tweetWithRelations) {
        throw new Error("Tweet not found");
      }

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);
      void ctx.revalidateSSG?.(`/tweets/${parentTweet.id}`);
      if (parentTweet.replyParentId) {
        void ctx.revalidateSSG?.(`/tweets/${parentTweet.replyParentId}`);
      }

      return tweetWithRelations as CreatedReplyTweet;
    }),
});

async function getInfiniteTweets({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; lastPostedAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { lastPostedAt_id: cursor } : undefined,
    orderBy: [{ lastPostedAt: "desc" }, { id: "desc" }],
    where: whereClause,
    // @ts-ignore
    select: tweetSelect(currentUserId)
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, lastPostedAt: nextItem.lastPostedAt };
    }
  }

  return {
    tweets: data.map((tweet) => {
      return tweetReturn(tweet, currentUserId);
    }),
    nextCursor,
  };
}

const tweetSelect = (currentUserId: string | undefined) => ({
  id: true,
  content: true,
  createdAt: true,
  lastPostedAt: true,
  replyParent: { select: parentTweetSelectArg() },
  _count: { select: { likes: true, replyChildren: true, echoes: true } },
  likes:
    currentUserId == null ? false : { where: { userId: currentUserId } }, // likes given by current user to the tweet (none or 1)
  echoes: { 
    select: { user: { select: { name: true, id: true } } },
    orderBy: { createdAt: "desc" },
  },
  replyChildren
    : currentUserId == null
    ? false
    : { where: { userId: currentUserId } },  // replies made by current user to the tweet (none or 1)
  user: {
    select: { name: true, id: true, image: true, handle: true },
  },
})

function parentTweetSelectArg() {
  return PARENT_TWEET_FIELDS.map((field) => ({ [field]: true })).reduce((acc, curr) => ({...acc, ...curr}), {}) as {[K in keyof ParentTweet]: true};
}

// TODO had to type tweet to any due to TS errors - it seems trpc in its current version is not as strictly typed as I'd like to
// which makes it impossible to accurately type the tweet (explicitly using the inferred type produces TS errors)
// @ts-ignore
function tweetReturn(tweet, currentUserId: string | undefined) {
  const echoedByMe = tweet.echoes.some((echo: {user: {id: string}}) => echo.user.id === currentUserId);
  return {
    id: tweet.id,
    content: tweet.content,
    replyParent: tweet.replyParent,
    createdAt: tweet.createdAt,
    lastPostedAt: tweet.lastPostedAt,
    likeCount: tweet._count.likes,
    replyCount: tweet._count.replyChildren,
    echoCount: tweet._count.echoes,
    user: tweet.user,
    isMine: tweet.user.id === currentUserId,
    likedByMe: tweet.likes?.length > 0,
    repliedByMe: tweet.replyChildren?.length > 0,
    echoes: tweet.echoes.slice(0, ECHOES_LIMIT + 1),
    echoedByMe,
  } as Tweet & { lastPostedAt: Date };
}


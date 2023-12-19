import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { CenterWrapper } from "~/components/layout/CenterWrapper";
import { TweetCard } from "~/components/tweet/TweetCard";
import { Echoes } from "~/components/tweet/Echoes";
import { RoundIconHover } from "~/components/shared/RoundIconHover";
import { useRouter } from "next/router";
import { VscArrowLeft } from "react-icons/vsc";
import { NewTweetForm } from "~/components/tweet/NewTweetForm";
import { useSession } from "next-auth/react";
import { InfiniteTweetList } from "~/components/tweet/InfiniteTweetList";

const TweetPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const router = useRouter();
  const session = useSession();

  const { data: tweet } = api.tweet.getById.useQuery({ id });


  if (tweet == null) {
    return <ErrorPage statusCode={404} />;
  }

  const isMyOwn = tweet.user.id === session.data?.user?.id;

  return (
    <>
      <Head>
        <title>{`Twitter Clone - ${tweet.user.name}'s tweet`}</title>
      </Head>
      <header className="sticky top-0 z-10 bg-white pt-2">
        <CenterWrapper>
          <div className="flex gap-2 pb-2 items-center">
            <div onClick={() => router.back()} className="mr-2 hover:cursor-pointer">
              <RoundIconHover>
                <VscArrowLeft className="h-6 w-6 p-[0.125rem]" />
              </RoundIconHover>
            </div>
            <h2 className="font-bold ">Post</h2>
          </div>
        </CenterWrapper>
      </header>
      <main>
        <CenterWrapper>
          <ul className="relative">
            <TweetCard {...tweet} includeEchoes={false} tweetPageHeader={true}/>
            {!!tweet.echoes.length && (
              <div className="absolute right-4 top-4 select-none">
                <Echoes echoes={tweet.echoes} expand={true}/>
              </div>
            )}
          </ul>
          {!isMyOwn && <div className="mt-1">
            <NewTweetForm replyForId={tweet.id}/>        
          </div>}
          <div className="mt-1">
            <ReplyTweets id={id} />
          </div>
        </CenterWrapper>
      </main>
    </>
  );
};

function ReplyTweets({id}: {id: string}) {
  const tweets = api.tweet.infiniteReplyFeed.useInfiniteQuery(
    { tweetId: id},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
      excludeReplyParents={true}
      emptyStateText="No replies yet"
    />
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.tweet.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default TweetPage;

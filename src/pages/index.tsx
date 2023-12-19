import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CenterWrapper } from "~/components/layout/CenterWrapper";
import { InfiniteTweetList } from "~/components/tweet/InfiniteTweetList";
import { NewTweetForm } from "~/components/tweet/NewTweetForm";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 bg-white pt-2">
        {session.status !== "authenticated" && (
          <CenterWrapper>
            <h1 className="mb-2 text-lg font-medium">Recent Tweets</h1>
          </CenterWrapper>
        )}
        {session.status === "authenticated" && (
          <CenterWrapper>
            <NewTweetForm />        
          </CenterWrapper>
        )}
        {session.status === "authenticated" && (
          <CenterWrapper>
            <div className="flex mt-4 bg-gray-50 border-t border-l border-r">
              {TABS.map((tab) => {
                return (
                  <button
                    key={tab}
                    className={`app-tab flex-grow basis-full p-2 hover:bg-slate-100 focus-visible:bg-slate-100 transition-colors duration-200 ${
                      tab === selectedTab
                        ? "active-tab"
                        : ""
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </CenterWrapper>
        )}
      </header> 
      <div className="max-w-xl m-auto">
        <CenterWrapper>
          {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
        </CenterWrapper>
      </div>
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;

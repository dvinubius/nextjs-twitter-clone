import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { TweetCard } from "./TweetCard";
import type { Tweet } from "~/types/tweet.type";

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
  excludeReplyParents?: boolean;
  emptyStateText?: string;
};

export function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore = false,
  excludeReplyParents = false,
  emptyStateText = 'No Tweets',
}: InfiniteTweetListProps) {
  if (isLoading) return (
    <div className="pt-48 flex flex-col items-center content-center">
      <LoadingSpinner />
    </div>
  );
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-12 text-center text-2xl text-gray-500">{emptyStateText}</h2>
    );
  }

  return (<>
    <ul className="infinite-scroll-wrapper">
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => {
          return <TweetCard key={tweet.id} {...tweet} includeReplyParent={!excludeReplyParents}/>;
        })}
      </InfiniteScroll>
    </ul>
    <div className="h-6"></div>
  </>
  );
}

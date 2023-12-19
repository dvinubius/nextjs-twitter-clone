import { InfiniteTweetList } from "~/components/tweet/InfiniteTweetList";
import { api } from "~/utils/api";

export function EchoedTweets({id}: {id: string}) {
  const tweets = api.tweet.infiniteEchoedFeed.useInfiniteQuery(
    { userId: id },
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
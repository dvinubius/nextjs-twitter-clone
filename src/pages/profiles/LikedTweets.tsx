import { InfiniteTweetList } from "~/components/tweet/InfiniteTweetList";
import { api } from "~/utils/api";

export default function LikedTweets({id}: {id: string}) {
  const tweets = api.tweet.infiniteLikedFeed.useInfiniteQuery(
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
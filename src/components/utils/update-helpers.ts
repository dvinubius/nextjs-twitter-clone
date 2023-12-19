import type { api } from "~/utils/api";
import { toast } from 'react-hot-toast';

export const updateFeeds = (
  {currentRoute, trpcUtils, replyForId, queryId} : {
    currentRoute: string,
    trpcUtils: ReturnType<typeof api.useContext>,
    replyForId?: string,
    queryId?: string,
  }) => {
  // (PARENT) TWEET PAGE UPDATE
  // This update would be enough if the creation of a reply
  // were always followed by a navigation to the tweet page
  if (currentRoute === '/tweets/[id]') {
    trpcUtils.tweet.infiniteReplyFeed.invalidate({ tweetId: replyForId })
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });
  }

  // INFINITE FEED UPDATE (ALL & FOLLOWING)
  if (currentRoute === '/') {
    trpcUtils.tweet.infiniteFeed.invalidate()
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });

    trpcUtils.tweet.infiniteFeed.invalidate({ onlyFollowing: true })
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });
  }
  
  // PROFILE PAGE: TWEETED / LIKED / ECHOED
  if (currentRoute === '/profiles/[id]') {
    const userId = queryId;
    trpcUtils.tweet.infiniteProfileFeed.invalidate({ userId })
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });

    trpcUtils.tweet.infiniteEchoedFeed.invalidate({ userId })
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });

    trpcUtils.tweet.infiniteLikedFeed.invalidate({ userId })
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });
  }
}
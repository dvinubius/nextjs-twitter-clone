import type { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { toast } from 'react-hot-toast';
import { updateFeeds } from "../utils/update-helpers";

export const createTweet = (
  {
    setInputValue,
    onTweetSuccess,
    session, 
    trpcUtils
  } : 
  {
    setInputValue: (input: string) => void,
    onTweetSuccess?: () => void,
    session: ReturnType<typeof useSession>
    trpcUtils: ReturnType<typeof api.useUtils>
  }
) => api.tweet.create.useMutation({
  onSuccess: () => {
    setInputValue("");
    if (session.status !== "authenticated") return;

    toast.success('Tweet posted!');

    if (onTweetSuccess) {
      onTweetSuccess();
    }

    trpcUtils.tweet.infiniteFeed.invalidate()
      .catch((e) => {
        console.error(e);
        toast.error('Some data could not be refreshed. Please reload the page');
      });
  },
  onError: (err) => {
    console.error(err);
    toast.error('Could not post tweet. Please try again later.');
  }
});

export const replyToTweet = (
  {
    setInputValue,
    onTweetSuccess,
    session, 
    trpcUtils,
    currentRoute,
    replyForId,
    queryId
  } : 
  {
    setInputValue: (input: string) => void,
    onTweetSuccess?: () => void,
    session: ReturnType<typeof useSession>
    trpcUtils: ReturnType<typeof api.useUtils>,
    currentRoute: string,
    replyForId?: string,
    queryId: string
  }
) => api.tweet.reply.useMutation({
  onSuccess: () => {

    setInputValue("");

    if (session.status !== "authenticated") return;     
    
    toast.success('Reply posted!');

    if (onTweetSuccess) {
      onTweetSuccess();
    }

    updateFeeds({
      currentRoute,
      trpcUtils,
      replyForId, 
      queryId
    })
  },
  onError: (err) => {
    console.error(err);
    toast.error('Could not post reply. Please try again later.');
  }
});
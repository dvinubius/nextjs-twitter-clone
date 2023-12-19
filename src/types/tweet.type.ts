export type TweetAuthor = {id: string, image: string | null; name: string, handle: string};

export const PARENT_TWEET_FIELDS = ['id', 'user', 'content', 'createdAt', 'replyParentId'] as const;

type ParentTweetFieldTypes = {
  id: string;
  user: TweetAuthor;
  content: string;
  createdAt: Date;
  replyParentId: string | null;
}  

export type ParentTweet = {
  [K in typeof PARENT_TWEET_FIELDS[number]]: ParentTweetFieldTypes[K];
};

export type Echo = {
  user: { id: string; name: string | null};
}

export type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  replyParent: ParentTweet | null;
  likeCount: number;
  replyCount: number;
  likedByMe: boolean;
  repliedByMe: boolean;
  echoedByMe: boolean;
  echoes: Echo[];
  echoCount: number;
  user: TweetAuthor;
  isMine: boolean;
};

export type CreatedTweet = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  lastPostedAt: Date;
  replyParentId: string | null;
}

export type CreatedReplyTweet = CreatedTweet & {
  replyParent: ParentTweet | null;
}
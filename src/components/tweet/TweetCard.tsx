import Link from "next/link";
import { toast } from 'react-hot-toast';

import { ProfileImage } from "../shared/ProfileImage";
import { api } from "~/utils/api";
import type { Tweet } from "../../types/tweet.type";
import { HeartButton } from "../tweet_actions/HeartButton";
import { ReplyButton } from "../tweet_actions/ReplyButton";
import { EchoButton } from "../tweet_actions/EchoButton";
import { Echoes } from "./Echoes";
import { useRouter } from "next/router";
import { useState, type MouseEvent } from "react";
import { QuotedTweetCard } from "./QuotedTweetCard";
import { ReplyModal } from "../tweet_actions/ReplyModal";
import { updateFeeds } from "../utils/update-helpers";
import { Tooltip } from "flowbite-react";

type TweetProps = Tweet & { includeEchoes?: boolean, tweetPageHeader?: boolean, includeReplyParent?: boolean };

export function TweetCard({
  id,
  user,
  isMine,
  content,
  createdAt,
  likeCount,
  likedByMe,
  replyCount,
  replyParent,
  echoedByMe,
  echoes,
  echoCount,
  includeEchoes = true,
  tweetPageHeader = false,
  includeReplyParent = true,
} : TweetProps) {

  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const currentRoute = router.pathname;

  const trpcUtils = api.useUtils();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: () => {
      updateFeeds({
        currentRoute,
        trpcUtils,
        queryId: router.query.id as string
      })
    },
    onError: (err) => {
      console.error(err);
      toast.error('Could not perform update. The algorithm finds it hard to believe that you liked this tweet.');
    }
  });
  
  const echo = api.tweet.echo.useMutation({
    onSuccess: () => {
      updateFeeds({
        currentRoute,
        trpcUtils,
        queryId: router.query.id as string
      })
    },
    onError: (err) => {
      console.error(err);
      toast.error('Could not perform update. The algorithm finds it hard to believe that you would echo this tweet.');
    }
  });

  function handleToggleLike(ev: MouseEvent) {
    ev.stopPropagation();
    toggleLike.mutate({ id });
  }

  function handleReply(ev: MouseEvent) {
    ev.stopPropagation();
    setOpenModal(true);
  }

  function handleEcho(ev: MouseEvent) {
    ev.stopPropagation();
    echo.mutate({ id });
  }

  function navigateToTweetPage() {
    void router.push(`/tweets/${id}`);
  }

  function onReplySuccess() {
    setOpenModal(false);
  }
  
  function navigateToQuotedTweetPage(event: MouseEvent) {
    event.stopPropagation();
    void router.push(`/tweets/${replyParent?.id ?? ''}`);
  }

  function onCloseModal() {
    setOpenModal(false);
  }

  function onProfileClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  return (
    <li className={`border-b border-x first:border-t px-4 py-4
      ${tweetPageHeader ? 'bg-zinc-50 user-box' : 'cursor-pointer hover:bg-gray-50'}`} 
      onClick={tweetPageHeader ? undefined : navigateToTweetPage}>
      <div className="flex gap-4">
        <Link href={`/profiles/${user.id}`} onClick={onProfileClick}>
          <ProfileImage src={user.image} />
        </Link>
        <div className="flex w-full">
          <div className="flex flex-grow flex-col">
            <div className="flex gap-1">
              <Link
                href={`/profiles/${user.id}`}
                onClick={onProfileClick}
                className="outline-none hover:underline focus-visible:underline"
              >
                <span className="font-bold">{user.name}</span>{' '}<span className='text-gray-600'>{user.handle}</span>
              </Link>
              <span className="text-gray-500">-</span>
              <span className="text-gray-500" suppressHydrationWarning>
                {dateTimeFormatter.format(createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap">{content}</p>
            <div className="mt-2 mx-2 -mb-1 flex items-center gap-6">
              <Tooltip content={<div>{likedByMe ? 'Unlike' : 'Like'}</div>} style="light" placement='top'>
                <HeartButton
                  onClick={handleToggleLike}
                  isLoading={toggleLike.isLoading}
                  likedByMe={likedByMe}
                  likeCount={likeCount}
                />
              </ Tooltip>
              <Tooltip content={<div>Reply</div>} style="light" placement='top'>
                <ReplyButton
                  onClick={handleReply}
                  isLoading={false}
                  replyCount={replyCount}
                />
              </Tooltip>
              <Tooltip content={<div>Echo</div>} style="light" placement='top' className={echoedByMe ? 'hidden' : ''}>
                <EchoButton
                  onClick={handleEcho}
                  isLoading={echo.isLoading}
                  echoedByMe={echoedByMe}
                  echoCount={echoCount}
                  isMine={isMine}
                />
              </Tooltip>
            </div>
          </div>
          {!!echoes?.length && includeEchoes && <Echoes echoes={echoes} expand={false}/>}
          {!!echoes?.length && !includeEchoes && <div className="w-[4.5rem]">{' '}</div>}
        </div>
      </div>
      {!!replyParent && includeReplyParent && (
        <ul>
          <QuotedTweetCard {...replyParent} classes="px-4 mt-3" onClick={navigateToQuotedTweetPage}/>
        </ul>
      )}
      <ReplyModal toId={id} toContent={content} toCreatedAt={createdAt} toUser={user} 
        openModal={openModal} onCloseModal={onCloseModal} onReplySuccess={onReplySuccess} />
    </li>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});
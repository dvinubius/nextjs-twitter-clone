import { Modal } from "flowbite-react";
import type { MouseEvent } from "react";
import { NewTweetForm } from "../tweet/NewTweetForm";
import { QuotedTweetCard } from "../tweet/QuotedTweetCard";
import type { TweetAuthor } from "~/types/tweet.type";

export function ReplyModal({
  toId, toUser, toContent, toCreatedAt,
  openModal, onCloseModal, onReplySuccess}: 
  {
    toId: string,
    toUser: TweetAuthor,
    toContent: string,
    toCreatedAt: Date,
    openModal: boolean, 
    onCloseModal: () => void, 
    onReplySuccess: () => void
  }) 
{
  const onClose = () => {
    onCloseModal();
  }

  // we don't want the events from the overlay to propagate to the tweet card
  const onClick = (ev: MouseEvent) => {
    ev.stopPropagation();
  }

  return (
    // @ts-ignore
    <Modal onClick={onClick} show={openModal} position={"top-center"} size="2xl" onClose={onClose} popup>
      <Modal.Header/>
      <Modal.Body>
        <div className="flex flex-col">
          <ul>
            <QuotedTweetCard id={toId} user={toUser} content={toContent} createdAt={toCreatedAt} classes="pointer-events-none border-none pb-0 pt-0"/>
          </ul>
          <div className="flex">
            <div className="ml-6 mr-8 mt-1 border-l border-slate-300 w-2 h-12"></div>
            <div className="mt-4 text-[0.9375em] text-gray-600">Replying to <span className="text-blue-500">{toUser.handle}</span></div>
          </div>
          <NewTweetForm replyForId={toId} onTweetSuccess={onReplySuccess} classes="border-none pt-0 pl-0 pr-0 -mt-3"/>
        </div>
      </Modal.Body>
    </Modal>
  );
}
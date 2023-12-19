import { useSession } from "next-auth/react";
import type { FormEvent } from "react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { api } from "~/utils/api";
import { Button } from "../shared/Button";
import { ProfileImage } from "../shared/ProfileImage";
import { MAX_TWEET_LENGTH } from "~/config/constants";
import { updateTextAreaSize } from "../utils/layout-helpers";
import { useRouter } from "next/router";
import { createTweet, replyToTweet } from "./updates";

export function NewTweetForm({classes='', replyForId, onTweetSuccess}: {classes?: string, replyForId?: string, onTweetSuccess?: () => void}) {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form classes={classes} replyForId={replyForId} onTweetSuccess={onTweetSuccess}/>;
}

function Form({classes, replyForId, onTweetSuccess}: {classes: string, replyForId?: string, onTweetSuccess?: () => void}) {
  const session = useSession();

  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useUtils();

  const router = useRouter();
  const currentRoute = router.pathname;

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const create = createTweet({onTweetSuccess, setInputValue, trpcUtils, session});
  const reply = replyToTweet({onTweetSuccess, setInputValue, trpcUtils, currentRoute, session, replyForId, queryId: router.query.id as string});

  if (session.status !== "authenticated") return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (replyForId) {
      reply.mutate({ content: inputValue, id: replyForId });
    } else {
      create.mutate({ content: inputValue });
    }
  }

  const charCountClass = inputValue.length > MAX_TWEET_LENGTH - 20 ? "text-red-500" : "";
  const charCountDisplay = MAX_TWEET_LENGTH - inputValue.length;

  const boxClasses = replyForId ? "border-l border-r" : "bg-zinc-50 user-box";
  const placeHolder = replyForId ? `Post your reply` : "What's happening?";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 border-b border-t px-4 py-2 min-h-24 ${boxClasses} ${classes}`}
    >
      <div className="flex items-center flex-grow">
        <SyncedProfileImage id={session.data.user.id}/>
        <textarea
          maxLength={MAX_TWEET_LENGTH}
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow text-xl resize-none overflow-hidden p-4 outline-none border-none bg-inherit placeholder-slate-500 no-shadow"
          placeholder={placeHolder}
        />
      </div>
      <div className="text-xs text-slate-500 w-14 mx-2"><span className={charCountClass}>{charCountDisplay}</span><span>  / {MAX_TWEET_LENGTH}</span></div>
      <Button className={`self-center ${!inputValue ? 'pointer-events-none' : ''}`} disabled={!inputValue}>Tweet</Button>
    </form>
  );
}

function SyncedProfileImage({id}: {id: string}) {
  const { data: profile } = api.profile.getById.useQuery({ id });
  return <ProfileImage src={profile?.image} />       
}
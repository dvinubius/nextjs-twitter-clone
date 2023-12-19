import Link from "next/link";
import { ProfileImage } from "../shared/ProfileImage";
import type { Tweet } from "../../types/tweet.type";
import type { MouseEventHandler } from "react";

type QuotedTweetProps = Pick<Tweet, "user" | "createdAt" | "content" | "id"> & {classes?: string, onClick?: MouseEventHandler};

export function QuotedTweetCard({
  user,
  content,
  createdAt,
  classes = '', 
  onClick
} : QuotedTweetProps) {
  return (
    <li className={`border rounded-lg py-4 cursor-pointer hover:bg-gray-100 text-[0.9375em] ${classes}`} 
      onClick={onClick}>
      <div className="flex gap-4">
        <Link href={`/profiles/${user.id}`}>
          <ProfileImage className="h-10 w-10" src={user.image} />
        </Link>
        <div className="flex w-full">
          <div className="flex flex-grow flex-col">
            <div className="flex gap-1">
              <Link
                href={`/profiles/${user.id}`}
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
          </div>
        </div>
      </div>
    </li>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});
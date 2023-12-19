import { useSession } from "next-auth/react";
import { RoundIconHover } from "../shared/RoundIconHover";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import type { MouseEventHandler } from "react";

type HeartButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

export function HeartButton({
  isLoading,
  onClick,
  likedByMe,
  likeCount,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 -ml-2 flex items-center gap-1 self-start text-gray-500">
        <div className="p-1 -mr-0.5">
          <HeartIcon />
        </div>
        <span className="text-sm">{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <RoundIconHover red classes="p-1 -mr-0.5">
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </RoundIconHover>
      <span className="text-sm">{likeCount}</span>
    </button>
  );
}

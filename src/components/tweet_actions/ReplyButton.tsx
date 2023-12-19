import { useSession } from "next-auth/react";
import { RoundIconHover } from "../shared/RoundIconHover";
import { VscReply } from "react-icons/vsc";
import type { MouseEventHandler } from "react";

type ReplyButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  replyCount: number;
};

export function ReplyButton({
  isLoading,
  onClick,
  replyCount,
}: ReplyButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 -ml-2 flex items-center gap-1 self-start text-gray-500">
        <div className="p-1 -mr-0.5">  
          <VscReply />
        </div>
        <span className="text-sm">{replyCount}</span>
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200
        text-gray-500 hover:text-blue-500 focus-visible:text-blue-500`}
    >
      <RoundIconHover blue classes="p-1 -mr-0.5">
        <VscReply
          className={`transition-colors duration-200
            fill-gray-500 group-hover:fill-blue-500 group-focus-visible:fill-blue-500
          `}
        />
      </RoundIconHover>
      <span className="text-sm">{replyCount}</span>
    </button>
  );
}

import { useSession } from "next-auth/react";
import { RoundIconHover } from "../shared/RoundIconHover";
import { VscGitCompare } from "react-icons/vsc";
import type { MouseEventHandler } from "react";

type EchoButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  echoedByMe: boolean;
  isMine: boolean;
  echoCount: number;
};

export function EchoButton({
  isLoading,
  onClick,
  echoedByMe,
  isMine,
  echoCount,
}: EchoButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 -ml-2 flex items-center gap-1 self-start text-gray-500">
        <div className="p-1 -mr-0.5">  
          <VscGitCompare />
        </div>
        <span className="text-sm">{echoCount}</span>
      </div>
    );
  }

  const isDisabled = isLoading || echoedByMe || isMine;
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        isDisabled
          ? "pointer-events-none cursor-default"
          : "hover:text-green-500 focus-visible:text-green-500"
      } ${ echoedByMe ? "text-green-500"  : "text-gray-500" }` }
    >
      <RoundIconHover green classes="p-1 -mr-0.5">
        <VscGitCompare
          className={`transition-colors duration-200 ${
            echoedByMe
              ? "fill-green-500"
              : "fill-gray-500"
          } ${ isDisabled ? "" : "group-hover:fill-green-500 group-focus-visible:fill-green-500" }` }
        />
      </RoundIconHover>
      <span className="text-sm">{echoCount}</span>
    </button>
  );
}

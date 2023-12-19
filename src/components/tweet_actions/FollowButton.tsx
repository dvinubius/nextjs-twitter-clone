import { useSession } from "next-auth/react";
import { Button } from "../shared/Button";

export function FollowButton({
  userId,
  isFollowing,
  isLoading,
  onClick,
}: {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button disabled={isLoading} onClick={onClick} small variant={isFollowing ? "transparent" : "black"} className="px-4 py-1 font-bold" >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
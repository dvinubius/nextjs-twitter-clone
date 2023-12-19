import { useSession } from "next-auth/react";
import { Button } from "../shared/Button";

export function EditProfileButton({
  userId,
  onClick,
}: {
  userId: string;
  onClick: () => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id !== userId) {
    return null;
  }

  return (
    <Button onClick={onClick} small variant="transparent" className="px-4 py-1 font-bold">
      Edit profile
    </Button>
  );
}
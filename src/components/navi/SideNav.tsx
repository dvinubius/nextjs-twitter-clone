import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { VscAccount, VscHome, VscInfo, VscSignIn, VscSignOut } from "react-icons/vsc";
import { RoundIconHover } from "../shared/RoundIconHover";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { Logo } from "../shared/Logo";
import { ProfileImage } from "../shared/ProfileImage";
import { LoggedInUser } from "./LoggedInUser";
import { api } from "~/utils/api";

const iconItem = (
  {
    icon, textPart, textSize = 'text-xl', textColor = '', topGap = 'gap-4', noHover
  } : {
    icon: ReactElement; 
    textPart: string | ReactNode; 
    textSize?: string; 
    textColor?: string; 
    topGap?: string;
    noHover?: boolean;
  }
) => (
  <RoundIconHover classes="p-2" noHover={noHover}>
    <span className={`flex items-center ${topGap}`}>
      {icon}
      {typeof textPart === 'string' ? <span className={`hidden md:inline ${textSize} ${textColor}`}>{textPart}</span> : textPart}
    </span>
  </RoundIconHover>
);

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  const router = useRouter();

  const linkHighlightClass = (route: string) => route === router.pathname ? "font-bold" : "";


  return (
    <nav className="sticky top-0 px-2 pt-2 pb-4 border-l h-screen bg-gray-50">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap h-full w-[160px]">
        <li className="mr-auto align-start">
          <Link href="/">
            <Logo />
          </Link>
        </li>
        {user != null && <>
          <li className={`${linkHighlightClass("/")}`}>
            <Link href="/">
              {iconItem({icon: <VscHome className="h-8 w-8" />, textPart: "Home"})}
            </Link>
          </li>
          <li className={`${linkHighlightClass('/profiles/[id]')}`}>
            <Link href={`/profiles/${user.id}`}>
              {iconItem({icon: <VscAccount className="h-8 w-8" />, textPart: "Profile"})}
            </Link>
          </li>
          <li className={`${linkHighlightClass('/about')}`}>
            <Link href={`/about`}>
              {iconItem({icon: <VscInfo className="h-8 w-8" />, textPart: "About"})}
            </Link>
          </li>
          <li className="mt-auto">
            <LoggedInUser content={
                <button onClick={() => void signOut()} className="">
                  {iconItem({
                    icon: <VscSignOut className="h-5 w-5"/>, 
                    textPart: 'Log Out',
                    textSize: 'text-md',
                    textColor: 'font-bold',
                   })
                  }
                </button>
              }
            >
            {user?.id && <UserDisplay id={user?.id}/>}
            </LoggedInUser>
          </li>
        </>}
        {user == null && (
          <li>
            <button onClick={() => void signIn()}>
              {iconItem({icon: <VscSignIn className="h-8 w-8"/>, textPart: 'Log In'})}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

function UserDisplay({id}: {id: string}) {
  const { data: profile } = api.profile.getById.useQuery({ id });

  return (
    iconItem({
      icon: <ProfileImage className="h-9 w-9" src={profile?.image} />, 
      textPart: (
        <div className={`hidden md:flex md:flex-col`}>
          <div className="font-bold text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">{profile?.name ?? ''}</div>
          <div className="text-xs text-slate-500 text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">{profile?.handle}</div>
        </div>
      ),
      topGap: 'gap-2',
      noHover: true
    })
  );
}

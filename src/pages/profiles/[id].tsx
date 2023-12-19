import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { ProfileImage } from "~/components/shared/ProfileImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CenterWrapper } from "~/components/layout/CenterWrapper";
import { useState } from "react";
import { RoundIconHover } from "~/components/shared/RoundIconHover";
import { VscArrowLeft, VscCalendar } from "react-icons/vsc";
import { EditProfileButton } from "~/components/user-profile/EditProfileButton";
import { FollowButton } from "~/components/tweet_actions/FollowButton";
import { EditProfileModal } from "~/components/user-profile/EditProfileModal";
import { Banner } from "~/components/user-profile/Banner";
import { AuthoredTweets, EchoedTweets, LikedTweets } from "./feeds";

const TABS = ["Tweeted", "Echoed", "Liked"] as const;

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Tweeted");

  const { data: profile } = api.profile.getById.useQuery({ id });
  
  const trpcUtils = api.useUtils();
  const session = useSession();
  const router = useRouter();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
    },
  });

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  if (!["authenticated", "loading"].includes(session.status) && (typeof window !== 'undefined')) {
    router.push('/').catch(console.error);
  }

  function handleEditProfile() {
    setOpenModal(true);
  }

  function onCloseModal() {
    setOpenModal(false);
  }

  // month and year
  const joinedDateDisplay: string = profile.joined.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Head>
        <title>{`Twitter Clone - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 bg-white pt-2">
        <CenterWrapper>
          <div className="flex gap-2 pb-2 items-center">
            <div onClick={() => router.back()} className="mr-2 hover:cursor-pointer">
              <RoundIconHover>
                <VscArrowLeft className="h-6 w-6 p-[0.125rem]" />
              </RoundIconHover>
            </div>
            <h2 className="font-bold ">{profile.name}</h2>
          </div>
          <div className="border-y bg-white user-box">
            <div className="relative mb-16">
              <Banner image={profile?.banner || '/images/placeholder.webp'} className="rounded-t-lg"/>
              <div className="absolute bottom-0 left-4">
                <ProfileImage src={profile.image} className="h-32 w-32 translate-y-[50%] border-white border-4" />
              </div>
            </div>
            <div className="flex items-start p-2">
              <div className="ml-2 flex-grow">
                <h1 className="text-lg font-bold">{profile.name}</h1>
                <div className="text-gray-500">{profile.handle}</div>
                <div className="mt-2 text-gray-700">{profile.bio}</div>
                <div className="mt-2 text-gray-500 flex items-center gap-2">{`Joined ${joinedDateDisplay}`} <VscCalendar className="h-4 w-4"/></div>
                <div className="mt-2 text-gray-500 text-sm">
                  <span className="font-bold text-gray-800">{profile.tweetsCount}{" "}</span>
                  {getPlural(profile.tweetsCount, "Tweet", "Tweets")} -{" "}
                  <span className="font-bold text-gray-800">{profile.followersCount}{" "}</span>
                  {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
                  <span className="font-bold text-gray-800">{profile.followsCount}{" "}</span>Following
                </div>
              </div>
              <div className="-mt-[3.75rem] mr-2">
                <FollowButton
                  isFollowing={profile.isFollowing}
                  isLoading={toggleFollow.isLoading}
                  userId={id}
                  onClick={() => toggleFollow.mutate({ userId: id })}
                />
              </div>
              <div className="-mt-[3.75rem] mr-2">
                <EditProfileButton
                  userId={id}
                  onClick={() => handleEditProfile()}
                />
              </div>
            </div>
          </div>
        </CenterWrapper>
        {session.status === "authenticated" && (
          <CenterWrapper>
            <div className="flex mt-4 bg-gray-50 border-t border-l border-r">
              {TABS.map((tab) => {
                return (
                  <button
                    key={tab}
                    className={`app-tab flex-grow basis-full p-2 hover:bg-slate-100 focus-visible:bg-slate-100 transition-colors duration-200 ${
                      tab === selectedTab
                        ? "active-tab"
                        : ""
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </CenterWrapper>
        )}
      </header>
      <main>
        <CenterWrapper>
          {selectedTab === "Tweeted" 
            ? <AuthoredTweets id={id}/> 
            : (selectedTab === "Echoed" 
              ? <EchoedTweets id={id}/> 
              : <LikedTweets id={id}/>)}
        </CenterWrapper>
      </main>
      <EditProfileModal user={{...profile, id}} openModal={openModal} onCloseModal={onCloseModal} />
    </>
  );
};

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;

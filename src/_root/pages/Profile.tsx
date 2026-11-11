import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GridPostList from "@/components/shared/GridPostList";
import ProfileSkeleton from "@/components/shared/ProfileSkeleton";
import StatBlock from "@/components/shared/StatBlock";
import EmptyState from "@/components/shared/EmptyState";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser, isPending } = useGetUserById(id || "");

  const isOwnProfile = user.id === currentUser?.$id;

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <EmptyState
          title="User not found"
          description="This profile doesn't exist or has been removed."
          icon="/assets/icons/people.svg"
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={getImageUrl(currentUser.imageId)}
            alt={`${currentUser.name}'s profile picture`}
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts?.length || 0} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            {currentUser.bio && (
              <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                {currentUser.bio}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {isOwnProfile && (
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
                aria-label="Edit your profile"
              >
                <img
                  src="/assets/icons/edit.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
                <span className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </span>
              </Link>
            )}
            {!isOwnProfile && (
              <Button
                type="button"
                className="shad-button_primary px-8"
                aria-label={`Follow ${currentUser.name}`}
              >
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <nav className="flex max-w-5xl w-full" aria-label="Profile tabs">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
            aria-current={pathname === `/profile/${id}` ? "page" : undefined}
          >
            <img
              src="/assets/icons/posts.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
            aria-current={pathname === `/profile/${id}/liked-posts` ? "page" : undefined}
          >
            <img
              src="/assets/icons/like.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            Liked Posts
          </Link>
        </nav>
      )}

      <Routes>
        <Route
          index
          element={
            currentUser.posts?.length > 0 ? (
              <GridPostList posts={currentUser.posts} showUser={false} />
            ) : (
              <EmptyState
                title="No posts yet"
                description={isOwnProfile ? "Share your first post!" : "This user hasn't posted yet."}
              />
            )
          }
        />
        {isOwnProfile && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;

import { Models } from "appwrite";

import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/GridPostList";
import GridPostSkeleton from "@/components/shared/GridPostSkeleton";
import EmptyState from "@/components/shared/EmptyState";

const Saved = () => {
  const { data: currentUser, isPending } = useGetCurrentUser();

  const savePosts = currentUser?.save
    ?.map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt=""
          className="invert-white"
          aria-hidden="true"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isPending ? (
        <GridPostSkeleton />
      ) : !savePosts || savePosts.length === 0 ? (
        <EmptyState
          title="No saved posts"
          description="Save posts to see them here"
          icon="/assets/icons/save.svg"
        />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          <GridPostList posts={savePosts} showStats={false} />
        </ul>
      )}
    </div>
  );
};

export default Saved;

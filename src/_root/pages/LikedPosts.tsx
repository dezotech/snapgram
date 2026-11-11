import GridPostList from "@/components/shared/GridPostList";
import GridPostSkeleton from "@/components/shared/GridPostSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser, isPending } = useGetCurrentUser();

  if (isPending) {
    return <GridPostSkeleton />;
  }

  if (!currentUser?.liked || currentUser.liked.length === 0) {
    return (
      <EmptyState
        title="No liked posts"
        description="Posts you like will appear here"
        icon="/assets/icons/like.svg"
      />
    );
  }

  return <GridPostList posts={currentUser.liked} showStats={false} />;
};

export default LikedPosts;

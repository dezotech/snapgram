import CreatorCard from "@/components/shared/CreatorCard";
import CreatorCardSkeleton from "@/components/shared/CreatorCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PostCard from "@/components/shared/PostCard";
import PostCardSkeleton from "@/components/shared/PostCardSkeleton";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    refetch: refetchPosts
  } = useGetRecentPosts();

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
    refetch: refetchCreators
  } = useGetUsers(10);

  const renderPosts = () => {
    if (isPostLoading) {
      return (
        <ul className="flex flex-col flex-1 gap-9 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={`skeleton-${i}`} className="flex justify-center w-full">
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (isErrorPosts) {
      return <ErrorState title="Failed to load posts" onRetry={() => refetchPosts()} />;
    }

    if (!posts?.documents || posts.documents.length === 0) {
      return (
        <EmptyState
          title="No posts yet"
          description="Be the first to share something with the community!"
        />
      );
    }

    return (
      <ul className="flex flex-col flex-1 gap-9 w-full">
        {posts.documents.map((post: Models.Document) => (
          <li key={post.$id} className="flex justify-center w-full">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    );
  };

  const renderCreators = () => {
    if (isUserLoading) {
      return (
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={`creator-skeleton-${i}`}>
              <CreatorCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (isErrorCreators) {
      return (
        <ErrorState
          title="Failed to load creators"
          onRetry={() => refetchCreators()}
        />
      );
    }

    if (!creators?.documents || creators.documents.length === 0) {
      return (
        <EmptyState
          title="No creators found"
          icon="/assets/icons/people.svg"
        />
      );
    }

    return (
      <ul className="grid 2xl:grid-cols-2 gap-6">
        {creators.documents.map((creator) => (
          <li key={creator.$id}>
            <CreatorCard user={creator} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {renderPosts()}
        </div>
      </div>

      <div className="home-creators bg-dark-2">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {renderCreators()}
      </div>
    </div>
  );
};

export default Home;

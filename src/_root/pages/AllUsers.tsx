import CreatorCard from "@/components/shared/CreatorCard";
import CreatorCardSkeleton from "@/components/shared/CreatorCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PageHeader from "@/components/shared/PageHeader";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { data: creators, isPending, isError, refetch } = useGetUsers();

  const renderContent = () => {
    if (isPending) {
      return (
        <ul className="user-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={`skeleton-${i}`} className="flex-1 min-w-[200px] w-full">
              <CreatorCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Failed to load users"
          description="Something went wrong while fetching users."
          onRetry={() => refetch()}
        />
      );
    }

    if (!creators?.documents || creators.documents.length === 0) {
      return (
        <EmptyState
          title="No users found"
          description="Be the first one here!"
          icon="/assets/icons/people.svg"
        />
      );
    }

    return (
      <ul className="user-grid">
        {creators.documents.map((creator) => (
          <li key={creator.$id} className="flex-1 min-w-[200px] w-full">
            <CreatorCard user={creator} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="common-container">
      <div className="user-container">
        <PageHeader icon="/assets/icons/people.svg" title="All Users" />
        {renderContent()}
      </div>
    </div>
  );
};

export default AllUsers;

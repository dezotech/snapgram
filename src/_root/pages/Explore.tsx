import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Models } from "appwrite";

import useDebounce from "@/hooks/useDebounce";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import GridPostSkeleton from "@/components/shared/GridPostSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { Input } from "@/components/ui/input";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | null | undefined;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <GridPostSkeleton />;
  }

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }

  return (
    <EmptyState
      title="No results found"
      description="Try searching for something else"
      icon="/assets/icons/search.svg"
    />
  );
};

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isPending } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults &&
    posts?.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt=""
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search posts..."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search posts"
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {isPending && !posts ? (
          <GridPostSkeleton />
        ) : shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <EmptyState
            title="No posts yet"
            description="Be the first to share something!"
          />
        ) : (
          posts?.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;

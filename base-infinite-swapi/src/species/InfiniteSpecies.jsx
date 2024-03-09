import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi-node.vercel.app";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["star-wars-species"],
    queryFn: ({ pageParam = initialUrl + "/api/species?page=1" }) =>
      fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? initialUrl + lastPage.next : undefined;
    },
  });
  return isLoading ? (
    <div className="loading">Loading...</div>
  ) : isError ? (
    <div className="error">Error! : {error.toString()}</div>
  ) : (
    <>
      {isFetching && <div className="loading">Loading more...</div>}
      <InfiniteScroll
        loadMore={() => {
          !isFetching && fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data?.pages.map((pageData) => {
          return pageData.results.map((species) => (
            <Species
              key={species.fields.name}
              name={species.fields.name}
              language={species.fields.language}
              averageLifespan={species.fields.average_lifespan}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}

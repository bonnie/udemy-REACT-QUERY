import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParams = initialUrl }) => fetchUrl(pageParams),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((spec) => (
            <Species
              key={spec.name}
              name={spec.name}
              language={spec.language}
              averageLifespan={spec.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}

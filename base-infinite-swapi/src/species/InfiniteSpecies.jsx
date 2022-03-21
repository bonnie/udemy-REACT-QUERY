import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";

import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined
    }
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>
  } else if (isError) {
    return <div>{error.message}</div>
  }
  
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {
          data.pages.map(pageData => {
            return pageData.results.map(specie => {
              return (
                <Species
                  key={specie.name}
                  name={specie.name}
                  language={specie.language}
                  averageLifespan={specie.averageLifespan}
                />
              )
            });
          })
        };
      </InfiniteScroll>
    </>
  );
}

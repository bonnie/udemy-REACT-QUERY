import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi-node.vercel.app";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["star-wars-people"],
    queryFn: ({ pageParam = initialUrl + "/api/people?page=1" }) =>
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
          return pageData.results.map((person) => (
            <Person
              key={person.fields.name}
              name={person.fields.name}
              hairColor={person.fields.hair_color}
              eyeColor={person.fields.eye_color}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}

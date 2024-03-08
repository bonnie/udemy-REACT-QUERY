import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2000,
  });
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button
          onClick={() => {
            deleteMutation.mutate(post.id);
            updateMutation.reset();
          }}
        >
          Delete
        </button>{" "}
        {deleteMutation.isPending && (
          <p className="loading">
            Deleting your post: {post.title}. Please hold.
          </p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Failed to delete {post.title}: {deleteMutation.error.toString()}`
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">Successfully (not) deleted {post.title}</p>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            updateMutation.mutate(post.id, "this is my new title");
            deleteMutation.reset();
          }}
        >
          Update title
        </button>
        {updateMutation.isPending && (
          <p className="loading">
            Updating your post: {post.title} with `this is my new title` .
            Please hold.
          </p>
        )}
        {updateMutation.isError && (
          <p className="error">
            Failed to update {post.title}: {updateMutation.error.toString()}
          </p>
        )}
        {updateMutation.isSuccess && (
          <p className="success">Successfully updated {post.title}</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}

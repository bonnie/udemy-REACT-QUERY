import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, updateMutation, deleteMutation }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading) {
    return <h3>Loading!</h3>;
  }

  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h2 className="title">{post.title}</h2>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {deleteMutation.isError && (
        <p className="error">
          Error deleting the post: {deleteMutation.error.message}
        </p>
      )}
      {deleteMutation.isLoading && <p className="loading">Deleting the post</p>}
      {deleteMutation.isSuccess && (
        <p className="success">Post has (not) been deleted</p>
      )}
      {updateMutation.isError && (
        <p className="error">
          Error updating the post: {updateMutation.error.message}
        </p>
      )}
      {updateMutation.isLoading && <p className="loading">Updating the post</p>}
      {updateMutation.isSuccess && (
        <p className="success">Post has (not) been updated</p>
      )}
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

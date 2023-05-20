import { useState } from 'react';

import { PostDetail } from './PostDetail';
import { useQuery } from '@tanstack/react-query';

const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0'
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isError, error, isLoading } = useQuery(['posts'], fetchPosts);

  return (
    <>
      <ul>
        {isError && (
          <>
            <h1>DEU RUIM</h1>
            <h2>{error.toString()}</h2>
          </>
        )}
        {!isLoading &&
          data?.map((post) => (
            <li
              key={post.id}
              className="post-title"
              onClick={() => setSelectedPost(post)}
            >
              {post.title}
            </li>
          ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {/* {selectedPost && selectedPost.id} */}
      {selectedPost && <PostDetail post={selectedPost} />}

    </>
  );
}

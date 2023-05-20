import { useState } from "react";

import { PostDetail } from "./PostDetail";
import { useQuery } from "@tanstack/react-query";

const maxPostPage = 10;

async function fetchPosts(page) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/posts?_limit=${maxPostPage}&_page=${page}`,
	);
	return response.json();
}

export function Posts() {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPost, setSelectedPost] = useState(null);

	const { data, isError, error, isLoading } = useQuery(["posts", currentPage], () =>
		fetchPosts(currentPage),
	);

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
				<button
					disabled={currentPage <= 1}
					onClick={() => {
						setCurrentPage((prevState) => prevState - 1);
					}}
				>
					Previous page
				</button>
				<span>Page {currentPage}</span>
				<button
					disabled={currentPage >= maxPostPage}
					onClick={() => {
						setCurrentPage((prevState) => prevState + 1);
					}}
				>
					Next page
				</button>
			</div>
			<hr />
			{/* {selectedPost && selectedPost.id} */}
			{selectedPost && <PostDetail post={selectedPost} />}
		</>
	);
}

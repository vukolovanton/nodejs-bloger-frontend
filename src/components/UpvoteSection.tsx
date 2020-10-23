import { Flex, IconButton } from "@chakra-ui/core";
import React from "react";
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
	post: PostsQuery["posts"]["posts"][0];
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
	const [, vote] = useVoteMutation();
	return (
		<Flex direction="column" justifyContent="center" alignItems="center" mr={6}>
			<IconButton
				variantColor={post.voteStatus === 1 ? "green" : undefined}
				icon="chevron-up"
				aria-label="Upvote post"
				onClick={() => {
					if (post.voteStatus === 1) {
						return;
					}
					vote({
						value: 1,
						postId: post.id,
					});
				}}
			></IconButton>
			{post.points}
			<IconButton
				variantColor={post.voteStatus === -1 ? "red" : undefined}
				icon="chevron-down"
				aria-label="Downvote post"
				onClick={() => {
					if (post.voteStatus === -1) {
						return;
					}
					vote({
						value: -1,
						postId: post.id,
					});
				}}
			></IconButton>
		</Flex>
	);
};

export default UpvoteSection;

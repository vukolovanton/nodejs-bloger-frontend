import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import React, { useState } from "react";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables: {
			limit: 10,
		},
	});

	return (
		<Layout variant="regular">
			<Flex align="center">
				<Heading>Blogger</Heading>
				<NextLink href="/create-post">
					<Link ml="auto">Create Post</Link>
				</NextLink>
			</Flex>
			<br />
			{data ? (
				<Stack>
					{data.posts.posts.map((p) => (
						<Box key={p.id} p={5} shadow="md" borderWidth="1px">
							<Heading fontSize="xl">{p.title}</Heading>
							<Text mt={4}>{p.textSnippet}</Text>
						</Box>
					))}
				</Stack>
			) : null}
			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						isLoading={fetching}
						m="auto"
						my={8}
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}
					>
						Load more
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Index);

import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import React from "react";
import { Link } from "@chakra-ui/core";

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<Layout>
			<NextLink href="/create-post">
				<Link>Create Post</Link>
			</NextLink>
			{data ? data.posts.map((p) => <div>{p.title}</div>) : null}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Index);

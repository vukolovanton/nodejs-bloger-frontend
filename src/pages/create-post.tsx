import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
	useIsAuth();
	const [, createPost] = useCreatePostMutation();
	const router = useRouter();

	return (
		<Layout variant="regular">
			<Formik
				initialValues={{ title: "", text: "" }}
				onSubmit={async (values) => {
					console.log(values);
					await createPost({ input: values });
					router.push("/");
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name="title" placeholder="Title " label="Title " />
						<Box mt={4}>
							<InputField
								textarea
								name="text"
								placeholder="Text..."
								label="Body"
							/>
						</Box>
						<Button
							mt={6}
							type="submit"
							variantColor="orange"
							isLoading={isSubmitting}
						>
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);

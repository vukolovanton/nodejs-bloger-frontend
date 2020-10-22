import { withUrqlClient } from "next-urql";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import React from "react";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Button,
	Box,
	Flex,
	Link,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { createUrqlClient } from "../utils/createUrqlClient";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [, login] = useLoginMutation();
	const router = useRouter();

	return (
		<Wrapper variant="small">
			<b>Log in</b>
			<Formik
				initialValues={{ usernameOrEmail: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						//succesfully registered
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="usernameOrEmail"
							placeholder="Username or email "
							label="Username or email "
						/>
						<Box mt={4}>
							<InputField
								name="password"
								placeholder="Password"
								label="Password"
								type="password"
							/>
						</Box>
						<Button
							mt={6}
							type="submit"
							variantColor="orange"
							isLoading={isSubmitting}
						>
							Login
						</Button>
						<Flex mt={6}>
							<NextLink href="/forgot-password">
								<Link>Restore password</Link>
							</NextLink>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);

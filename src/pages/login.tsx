import { Form, Formik } from "formik";
import React from "react";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Button,
	Box,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [, login] = useLoginMutation();
	const router = useRouter();

	return (
		<Wrapper variant="small">
			<b>Log in</b>
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({
						username: values.username,
						password: values.password,
					});
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
							name="username"
							placeholder="Username"
							label="Username"
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
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;

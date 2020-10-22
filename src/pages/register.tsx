import { Form, Formik } from "formik";
import React from "react";
import { Button, Box } from "@chakra-ui/core";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const [, register] = useRegisterMutation();
	const router = useRouter();

	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ email: "", username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register({ options: values });
					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
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
						<Box>
							<InputField name="email" placeholder="Email" label="Email" />
						</Box>
						<Button
							mt={6}
							type="submit"
							variantColor="orange"
							isLoading={isSubmitting}
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Register);

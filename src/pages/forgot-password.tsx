import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";

const ForgotPasswrod: React.FC<{}> = () => {
	const [, forgotPasswrod] = useForgotPasswordMutation();
	const [complete, setComplete] = useState(false);
	const router = useRouter();
	return (
		<Wrapper variant="small">
			<b>Log in</b>
			<Formik
				initialValues={{ email: "" }}
				onSubmit={async (values, { setErrors }) => {
					await forgotPasswrod(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box> if account exists we will send you a link</Box>
					) : (
						<Form>
							<InputField name="email" placeholder="Email" label="Email" />
							<Button
								mt={6}
								type="submit"
								variantColor="orange"
								isLoading={isSubmitting}
							>
								Send Link
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPasswrod);

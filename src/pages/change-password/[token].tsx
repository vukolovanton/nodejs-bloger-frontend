import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { query } from "@urql/exchange-graphcache";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswrodMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";

const ChangePasswrod: NextPage<{ token: string }> = ({ token }) => {
	const router = useRouter();
	const [, changePassword] = useChangePasswrodMutation();
	return (
		<Wrapper variant="small">
			<b>Log in</b>
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token,
					});
					if (response.data?.changePassword.errors) {
						setErrors(toErrorMap(response.data.changePassword.errors));
					} else if (response.data?.changePassword.user) {
						//succesfully registered
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="newPassword"
							placeholder="New password"
							label="New Password"
							type="password"
						/>
						<Button
							mt={6}
							type="submit"
							variantColor="orange"
							isLoading={isSubmitting}
						>
							Change password
						</Button>
						<Flex>
							<Box mr={2} style={{ color: "red" }}>
								Token error
							</Box>
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

ChangePasswrod.getInitialProps = ({ query }) => {
	return {
		token: query.token as string,
	};
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePasswrod);

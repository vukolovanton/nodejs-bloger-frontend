import React from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = null;

	if (fetching) {
		// Data is loading
	} else if (!data?.me) {
		// User not logged in
		body = (
			<>
				<NextLink href="/login">
					<Link mr={4} color="white">
						Login
					</Link>
				</NextLink>
				<NextLink href="/register">
					<Link color="white">Register</Link>
				</NextLink>
			</>
		);
	} else {
		body = (
			<Flex>
				<Box mr={4}>{data.me.username}</Box>
				<Button
					variant="link"
					isLoading={logoutFetching}
					onClick={() => {
						logout();
					}}
				>
					Logout
				</Button>
			</Flex>
		);
	}
	return (
		<Flex bg="tomato" p={4} position="sticky" top={0} zIndex={2}>
			<Box ml={"auto"}>{body}</Box>
		</Flex>
	);
};

export default Navbar;

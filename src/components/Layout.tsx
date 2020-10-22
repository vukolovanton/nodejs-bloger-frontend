import React from "react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

interface LayoutProps {
	variant?: "small" | "regular";
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
	return (
		<>
			<Navbar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};

export default Layout;

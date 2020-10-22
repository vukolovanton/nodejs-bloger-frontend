import { withUrqlClient } from "next-urql";
import Navbar from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<>
			<Navbar />
			<h1>Hello bitch</h1>
			{data ? data.posts.map((p) => <div>{p.title}</div>) : null}
		</>
	);
};

export default withUrqlClient(createUrqlClient)(Index);

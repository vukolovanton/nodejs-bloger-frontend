import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import qql from "graphql-tag";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
	LoginMutation,
	MeQuery,
	MeDocument,
	RegisterMutation,
	LogoutMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import { updateQuery } from "./updateQuery";
import { isServer } from "./isServer";

const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;

		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}

		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;

		const isInTheCache = cache.resolve(
			cache.resolveFieldByKey(entityKey, fieldKey) as string,
			"posts"
		);
		info.partial = !isInTheCache;

		const results: string[] = [];
		let hasMore = true;

		fieldInfos.forEach((fi) => {
			const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
			const data = cache.resolve(key, "posts") as string[];
			const _hasMore = cache.resolve(key, "hasMore");
			if (!_hasMore) {
				hasMore = _hasMore as boolean;
			}
			results.push(...data);
		});

		return {
			__typename: "PaginatedPosts",
			hasMore,
			posts: results,
		};
	};
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = "";
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie;
	}
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: cookie
				? {
						cookie,
				  }
				: undefined,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					PaginatedPosts: () => null,
				},
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
				updates: {
					Mutation: {
						vote: (_result, args, cache, info) => {
							const { postId, value } = args as VoteMutationVariables;
							const data = cache.readFragment(
								qql`
								fragment _ on Post {
									id
									points
									voteStatus
								}
							`,
								{ id: postId } as any
							);
							if (data) {
								if (data.voteStatus === value) {
									return;
								}
								const newPoints =
									(data.points as number) + (data.voteStatus ? 1 : 2) * value;
								cache.writeFragment(
									qql`
									fragment __ on Post {
										points
										voteStatus
									}
								`,
									{ id: postId, points: newPoints, voteStatus: value } as any
								);
							}
						},
						createPost: (_result, args, cache, info) => {
							const allFields = cache.inspectFields("Query");
							const fieldInfos = allFields.filter(
								(info) => info.fieldName === "posts"
							);
							fieldInfos.forEach((fi) => {
								cache.invalidate("Query", "posts", fi.arguments || {});
							});
							cache.invalidate("Query", "posts", {
								limit: 15,
							});
						},
						login: (_result, args, cache, info) => {
							updateQuery<LoginMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.login.errors) {
										return query;
									} else {
										return {
											me: result.login.user,
										};
									}
								}
							);
						},
						register: (_result, args, cache, info) => {
							updateQuery<RegisterMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.register.errors) {
										return query;
									} else {
										return {
											me: result.register.user,
										};
									}
								}
							);
						},
						logout: (_result, args, cache, info) => {
							updateQuery<LogoutMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								() => ({ me: null })
							);
						},
					},
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	};
};

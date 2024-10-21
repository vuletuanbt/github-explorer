import { getGraphqlSdk } from "@/lib/graphql/client";
export const searchUsers = async (query: string) => {
  try {
    const { result } = await getGraphqlSdk().searchUsers({ query });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

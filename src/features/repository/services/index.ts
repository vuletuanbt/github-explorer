import {
  GetRepositoryVariables,
  GetUserRepositoriesVariables,
} from "@/generated-sdk";
import { getGraphqlSdk } from "@/lib/graphql/client";

export const repositoryCursorPagination = async (
  payload: GetUserRepositoriesVariables
) => {
  try {
    const result = await getGraphqlSdk().GetUserRepositories(payload);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRepository = async (payload: GetRepositoryVariables) => {
  try {
    const result = await getGraphqlSdk().getRepository(payload);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

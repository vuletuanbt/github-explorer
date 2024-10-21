import {
  CreateIssueVariables,
  GetRepositoryIssuesVariables,
} from "@/generated-sdk";
import { getGraphqlSdk } from "@/lib/graphql/client";

export const issueCursorPagination = async (
  payload: GetRepositoryIssuesVariables
) => {
  try {
    const result = await getGraphqlSdk().GetRepositoryIssues(payload);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createIssue = async (payload: CreateIssueVariables) => {
  try {
    const result = await getGraphqlSdk().createIssue(payload);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import {
  GetRepositoryIssuesVariables,
  GetRepositoryIssues,
  CreateIssue,
} from "@/generated-sdk";
import { IssueInput } from "../types";

export const fetchIssues = async (
  context: any,
  query: GetRepositoryIssuesVariables
): Promise<GetRepositoryIssues> => {
  const { owner, name } = query;
  const params = new URLSearchParams({ owner, name });
  if (context.pageParam) {
    params.append("after", context.pageParam);
  }
  const queryString = params.toString();
  const res = await fetch(`/api/issues?${queryString}`);
  const result = (await res.json()) as GetRepositoryIssues;
  return result;
};

export async function createIssue(data: IssueInput): Promise<CreateIssue> {
  const { repositoryId, title, body } = data;

  const formData = new FormData();
  formData.append("repositoryId", repositoryId);
  if (title) {
    formData.append("title", title);
  }
  if (body) {
    formData.append("body", body);
  }
  const res = await fetch(`/api/issues`, {
    method: "POST",
    body: formData,
  });
  const result = (await res.json()) as CreateIssue;
  return result;
}

import {
  GetRepository,
  GetRepositoryVariables,
  GetUserRepositories,
} from "@/generated-sdk";
import { apiUrl } from "@/shared/utils";

export const fetchRepositories = async (
  context: any,
  username: string
): Promise<GetUserRepositories> => {
  const params = new URLSearchParams({ username });
  if (context.pageParam) {
    params.append("after", context.pageParam);
  }
  const queryString = params.toString();
  const res = await fetch(`/api/repositories?${queryString}`);
  const result = (await res.json()) as GetUserRepositories;
  return result;
};

/**
 * using on client-side
 * @param param
 * @returns
 */
export const fetchRepository = async (
  param: GetRepositoryVariables
): Promise<GetRepository> => {
  const res = await fetch(
    apiUrl(`/api/users/${param.owner}/repository/${param.name}`)
  );
  const result = (await res.json()) as GetRepository;
  return result;
};

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  GetRepositoryIssues,
  GetRepositoryIssuesVariables,
} from "@/generated-sdk";
import { fetchIssues } from "../action";

export default function useIssueCursorPagination(
  params: GetRepositoryIssuesVariables
) {
  return useInfiniteQuery<GetRepositoryIssues>({
    queryKey: ["issues", params],
    queryFn: (context) => fetchIssues(context, params),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.result?.issues?.pageInfo.endCursor,
  });
}

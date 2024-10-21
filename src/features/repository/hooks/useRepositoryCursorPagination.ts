"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { GetUserRepositories } from "@/generated-sdk";
import { fetchRepositories } from "../action";

export default function useRepositoryCursorPagination(username: string) {
  return useInfiniteQuery<GetUserRepositories>({
    queryKey: ["repositories", username],
    queryFn: (context) => fetchRepositories(context, username),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result?.repositories.pageInfo.endCursor,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { GetRepository, GetRepositoryVariables } from "@/generated-sdk";
import { fetchRepository } from "../action";

export default function useRepositoryQuery(params: GetRepositoryVariables) {
  const { name, owner } = params;
  return useQuery<GetRepository>({
    queryKey: ["repository", name, owner],
    queryFn: () => fetchRepository({ name, owner }),
    staleTime: 1000,
  });
}

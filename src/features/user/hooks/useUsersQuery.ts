"use client";
import { UserFields } from "@/generated-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "../action";

export default function useUsersQuery(keyword: string) {
  return useQuery<UserFields[]>({
    queryKey: ["users", keyword],
    queryFn: () => fetchUsers(keyword),
    staleTime: 1000,
  });
}

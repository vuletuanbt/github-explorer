import { SearchUsers, UserFields } from "@/generated-sdk";

const formatUsers = (data: SearchUsers): UserFields[] | [] => {
  return data.result?.edges?.map((edge) => edge?.node as UserFields) ?? [];
};

export async function fetchUsers(keyword: string) {
  if (!keyword) {
    return [];
  }
  const res = await fetch(`/api/users?keyword=${keyword}`);
  const result = await res.json() as SearchUsers;
  return formatUsers(result);
}

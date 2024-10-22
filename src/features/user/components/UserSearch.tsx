"use client";
import { useState } from "react";
import RepositoryInfiniteScroll from "@/features/repository/components/RepositoryInfiniteScroll";
import useUsersQuery from "../hooks/useUsersQuery";
import Image from "next/image";

interface UserSearchProps {
  keyword: string;
}

export default function UserSearch({ keyword }: UserSearchProps) {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const { data: users } = useUsersQuery(keyword);

  return (
    <>
      <section className="w-full flex-1 mt-10">
        <h3 className="text-2xl text-left mb- font-semibold">User</h3>
        <section className="flex flex-col-reverse items-center">
          <div className="flex flex-wrap m-2 items-centers">
            {users?.map((user) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
                key={user.id}
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    key={user.id}
                    src={user.avatarUrl}
                    alt={user.login}
                    className="w-full h-full object-cover"
                    onClick={() => setUsername(user.login)}
                    width={256}
                    height={256}
                  />
                </div>
                <span className="text-black z-10">{user.login}</span>
              </div>
            ))}
          </div>
        </section>

        {username && (
          <section className="w-full flex-1 mt-10">
            <h3 className="text-2xl text-left mb-10 font-semibold">
              Repository
            </h3>
            <RepositoryInfiniteScroll username={username} key={username} />
          </section>
        )}
      </section>
    </>
  );
}

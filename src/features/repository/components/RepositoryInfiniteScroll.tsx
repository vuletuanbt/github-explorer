"use client";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Link from "next/link";
import useRepositoryCursorPagination from "../hooks/useRepositoryCursorPagination";

interface RepoRepositoryInfiniteScrollProps {
  username: string;
}

const RepositoryInfiniteScroll = ({
  username,
}: RepoRepositoryInfiniteScrollProps) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepositoryCursorPagination(username);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="space-y-6">
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 md:grid-cols-3">
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.result?.repositories.edges?.map((edge) => (
              <div
                className="flex flex-row justify-between"
                style={{ lineHeight: 3 }}
                key={edge?.node?.id}
              >
                <h3 className="text-lg font-thin">
                  <Link
                    href={`/users/${username}/repository/${edge?.node?.name}`}
                    className="text-lg"
                    
                  >
                    {edge?.node?.name}
                  </Link>
                </h3>
                <span className="text-gray-400">
                  {edge?.node?.stargazerCount} stars /{" "}
                  {edge?.node?.watchers.totalCount} watching
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {isFetchingNextPage && hasNextPage ? (
        <p className="text-center">Loading more...</p>
      ) : (
        <p className="text-center">No more repository found</p>
      )}

      <div ref={ref} />
    </div>
  );
};

export default RepositoryInfiniteScroll;

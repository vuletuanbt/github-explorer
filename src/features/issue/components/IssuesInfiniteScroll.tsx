"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useIssueCursorPagination from "../hooks/useIssueCursorPagination";

interface IssueInfiniteScrollProps {
  name: string;
  owner: string;
}

export const RepositoryInfiniteScroll = ({
  name,
  owner,
}: IssueInfiniteScrollProps) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useIssueCursorPagination({ owner, name });
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
            {group.result?.issues.edges?.map((edge) => (
              <div
                className="flex flex-row justify-between"
                style={{ lineHeight: 3 }}
                key={edge?.node?.id}
              >
                <h3 className="text-lg font-thin">{edge?.node?.title}</h3>
                <span className="text-gray-400">
                  {edge?.node?.createdAt} {" by "}
                  {edge?.node?.author?.login}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {isFetchingNextPage && hasNextPage ? (
        <p className="text-center">Loading more...</p>
      ) : (
        <p className="text-center">No more issue found</p>
      )}

      <div ref={ref} />
    </div>
  );
};

export default RepositoryInfiniteScroll;

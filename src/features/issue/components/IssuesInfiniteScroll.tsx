"use client";

import { useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import useIssueCursorPagination from "../hooks/useIssueCursorPagination";
import { formatDistanceToNow } from "date-fns";

interface IssueInfiniteScrollProps {
  name: string;
  owner: string;
}

export const IssuesInfiniteScroll = ({
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
          <Fragment key={i}>
            {group.result?.issues.edges?.map((edge) => (
              <div
                className="flex flex-row justify-between"
                style={{ lineHeight: 4 }}
                key={edge?.node?.id}
              >
                <h3 className="text-lg font-thin">{edge?.node?.title}</h3>
                <span className="text-gray-400">
                  {formatDistanceToNow(edge?.node?.createdAt)} {" by "}
                  {edge?.node?.author?.login}
                </span>
              </div>
            ))}
          </Fragment>
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

export default IssuesInfiniteScroll;

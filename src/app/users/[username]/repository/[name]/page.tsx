import IssuesInfiniteScroll from "@/features/issue/components/IssuesInfiniteScroll";
import IssueCreateModal from "@/features/issue/components/IssueCreateModal";
import { fetchRepository } from "@/features/repository/action";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function Repository({
  params,
}: {
  params: { name: string; username: string };
}) {
  const { username: owner, name } = params;
  const repository = await fetchRepository({ owner, name });
  if (!repository.result) {
    return notFound();
  }
  return (
    <div className="px-10 text-center h-screen w-screen flex items-center flex-col">
      {/* Content Section */}

      <section className="content-section w-full flex-1">
        {/* where to put page cownt */}
        <section className="flex justify-between">
          <h2 className="text-3xl font-bold">{repository?.result?.name}</h2>
          <h3 className="text-gray-400">
            {repository?.result?.stargazerCount} stars /{" "}
            {repository?.result?.watchers?.totalCount} watching
          </h3>
        </section>

        <Suspense fallback={<div>Loading...</div>}>
          <section className="flex justify-between mt-10">
            <h1 className="text-2xl font-bold">Open Issues</h1>

            {/* Create Issue */}
            {repository?.result?.id && (
              <IssueCreateModal repositoryId={repository?.result?.id} />
            )}
            {/* Create Issue */}
          </section>

          <IssuesInfiniteScroll
            owner={owner}
            name={name}
            key={`${owner}${name}`}
          />
        </Suspense>
      </section>
      {/* Content Section */}
    </div>
  );
}

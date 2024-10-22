import IssueCreateModal from "@/features/issue/components/IssueCreateModal";
import IssuesInfiniteScroll from "@/features/issue/components/IssuesInfiniteScroll";
import { fetchRepository } from "@/features/repository/action";
import { notFound } from "next/navigation";
import { Fragment } from "react";

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
    <Fragment>
      <section className="w-full flex-1 mt-10">
        <section className="flex justify-between">
          <h2 className="text-3xl font-bold">{repository?.result?.name}</h2>
          <h3 className="text-gray-400">
            {repository?.result?.stargazerCount} stars /{" "}
            {repository?.result?.watchers?.totalCount} watching
          </h3>
        </section>
        <section className="float-right">
          <IssueCreateModal repositoryId={repository.result.id} />
        </section>

        <section className="w-full flex-1 mt-10">
          <IssuesInfiniteScroll
            owner={owner}
            name={name}
            key={`${owner}${name}`}
          />
        </section>
      </section>
    </Fragment>
  );
}

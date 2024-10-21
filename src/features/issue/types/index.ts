import { CreateIssueVariables } from "@/generated-sdk";

export type IssueInput = Pick<CreateIssueVariables, "repositoryId"> & {
  title?: string;
  body?: string;
};

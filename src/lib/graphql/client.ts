import { getSdk } from "@/generated-sdk";
import { GraphQLClient } from "graphql-request";

export const getGraphqlSdk = () => {
  if(!process.env.GITHUB_GRAPH_API_ENDPOINT || !process.env.GITHUB_GRAPH_API_TOKEN) {
      throw new Error(`Missing Github environment`)
  }
  const client = new GraphQLClient(
    process.env.GITHUB_GRAPH_API_ENDPOINT as string,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_GRAPH_API_TOKEN}`,
      },
    }
  );
  return getSdk(client);
};

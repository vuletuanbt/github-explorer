import { Types } from "@graphql-codegen/plugin-helpers";

const config: Types.Config = {
  documents: ["src/features/**/graphql/*.gql"],
  errorsOnly: true,
  generates: {
    "./src/generated-sdk.ts": {
      config: {
        dedupeOperationSuffix: true,
        documentMode: "graphQLTag",
        namingConvention: {
          enumValues: "keep",
          typeNames: "change-case-all#pascalCase",
        },
        nonOptionalTypename: false,
        omitOperationSuffix: true,
        scalars: {},
        skipTypename: true,
      },
      plugins: [
        "typescript",
        "typescript-graphql-request",
        "typescript-operations",
      ],
    },
  },
  ignoreNoDocuments: true,
  overwrite: true,
  schema: "node_modules/@octokit/graphql-schema/schema.graphql",
  silent: true,
};

export default config;

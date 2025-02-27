/** @format */

import { GraphQLClient } from "graphql-request";
import { cache } from "react";

export const graphQLClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "",
  {
    fetch: cache(
      async (url: string | Request | URL, params: RequestInit | undefined) =>
        fetch(url, { ...params, next: { revalidate: 60 } }),
    ),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_JWT_TOKEN || ""}`,
      "x-hasura-role": "request-scan",
    },
  },
);

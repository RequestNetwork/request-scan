/** @format */

import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || '',
  {
    headers: {
      'x-hasura-admin-secret':
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET || '',
    },
  },
);

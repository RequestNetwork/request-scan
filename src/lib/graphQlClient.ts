/** @format */

import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || '',
  {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_JWT_TOKEN || ''}`,
      'x-hasura-role': 'request-scan',
    },
  },
);

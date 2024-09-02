/** @format */
'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || '',
    fetchOptions: { cache: 'no-store' },
    headers: {
      'x-hasura-admin-secret':
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET || '',
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

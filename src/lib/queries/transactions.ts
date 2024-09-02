/** @format */

import { gql, DocumentNode } from '@apollo/client';

export const TRANSACTIONS_QUERY: DocumentNode = gql`
  query TransactionsQuery($first: Int, $skip: Int!) {
    storage {
      transactions(
        first: $first
        skip: $skip
        orderBy: blockNumber
        orderDirection: desc
        where: { data_not: null }
      ) {
        blockNumber
        blockTimestamp
        channelId
        data
        dataHash
        hash
        id
        size
      }
    }
  }
`;

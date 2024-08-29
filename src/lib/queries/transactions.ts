/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Transaction } from '../types';

export const TRANSACTIONS_QUERY = gql`
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

export const fetchRequests = async (variables: {
  first: number;
  skip: number;
}): Promise<{ storage: { transactions: Transaction[] } }> => {
  return await graphQLClient.request(TRANSACTIONS_QUERY, variables);
};

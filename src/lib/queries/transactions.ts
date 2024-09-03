/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Transaction } from '../types';
import { groupBy } from '../utils';

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
        smartContractAddress
      }
    }
  }
`;

export const fetchRequests = async (variables: {
  first: number;
  skip: number;
}): Promise<{
  [channelId: string]: Transaction[];
}> => {
  const data: { storage: { transactions: Transaction[] } } =
    await graphQLClient.request(TRANSACTIONS_QUERY, variables);

  return data?.storage.transactions
    ? groupBy(
        data?.storage.transactions.map((transaction: Transaction) => {
          return {
            ...transaction,
            dataObject: JSON.parse(transaction.data),
          };
        }),
        'channelId',
      )
    : [];
};

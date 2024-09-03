/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Transaction } from '../types';
import { groupBy } from '../utils';

export const ADDRESS_TRANSACTIONS_QUERY = gql`
  query AddressTransactionsQuery($first: Int, $skip: Int!, $address: String) {
    storage {
      transactions(
        first: $first
        skip: $skip
        orderBy: blockNumber
        orderDirection: desc
        where: { data_contains: $address }
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

export const fetchAddressRequests = async (variables: {
  first: number;
  skip: number;
  address: string;
}): Promise<{
  [channelId: string]: Transaction[];
}> => {
  const data: { storage: { transactions: Transaction[] } } =
    await graphQLClient.request(ADDRESS_TRANSACTIONS_QUERY, variables);

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

/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Transaction } from '../types';
import { groupBy } from '../utils';
import { getAddress } from 'viem';

export const ADDRESS_TRANSACTIONS_QUERY = gql`
  query AddressTransactionsQuery(
    $first: Int
    $skip: Int!
    $checksumAddress: String
    $lowercaseAddress: String
  ) @cached {
    storage {
      transactions(
        first: $first
        skip: $skip
        orderBy: blockNumber
        orderDirection: desc
        where: {
          or: [
            { data_contains: $checksumAddress }
            { data_contains: $lowercaseAddress }
          ]
        }
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
  const formatedVariables = {
    first: variables.first,
    skip: variables.skip,
    checksumAddress: getAddress(variables.address),
    lowercaseAddress: variables.address.toLowerCase(),
  };

  const data: { storage: { transactions: Transaction[] } } =
    await graphQLClient.request(ADDRESS_TRANSACTIONS_QUERY, formatedVariables);

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

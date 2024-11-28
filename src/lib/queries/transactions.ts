/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import { Transaction } from "../types";
import { groupBy } from "../utils";

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
    storage_sepolia {
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
  const data: {
    storage: { transactions: Transaction[] };
    storage_sepolia: { transactions: Transaction[] };
  } = await graphQLClient.request(TRANSACTIONS_QUERY, variables);

  const allTransactions = [
    ...(data?.storage?.transactions || []),
    ...(data?.storage_sepolia?.transactions || []),
  ].sort((a, b) => b.blockTimestamp - a.blockTimestamp); // Sort by timestamp, newest first

  const latestTransactions = allTransactions.slice(0, variables.first);

  return latestTransactions.length
    ? groupBy(
        latestTransactions.map((transaction: Transaction) => {
          return {
            ...transaction,
            dataObject: JSON.parse(transaction.data),
          };
        }),
        "channelId"
      )
    : [];
};

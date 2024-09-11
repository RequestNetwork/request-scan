/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Channel, Transaction } from '../types';

export const CHANNEL_QUERY = gql`
  query ChannelQuery($id: ID!) @cached {
    storage {
      channel(id: $id) {
        id
        topics
        transactions {
          data
          blockNumber
          blockTimestamp
          channelId
          dataHash
          encryptedData
          encryptedKeys
          encryptionMethod
          hash
          id
          publicKeys
          size
          smartContractAddress
          topics
          transactionHash
        }
      }
    }
  }
`;

export const fetchRequest = async (variables: {
  id: string;
}): Promise<Channel | null> => {
  const data: { storage: { channel: Channel } } = await graphQLClient.request(
    CHANNEL_QUERY,
    variables,
  );

  if (!data?.storage.channel) {
    return null;
  }

  return {
    ...data.storage.channel,
    transactions: data?.storage.channel.transactions.map(
      (transaction: Transaction) => {
        try {
          return {
            ...transaction,
            dataObject: JSON.parse(transaction.data),
          };
        } catch (error: any) {
          console.error(`Error parsing transaction data: ${error.message}`);
          return transaction;
        }
      },
    ),
  };
};

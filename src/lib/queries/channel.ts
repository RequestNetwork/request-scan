/** @format */

import { gql } from 'graphql-request';
import { graphQLClient } from '../graphQlClient';
import { Channel, Transaction } from '../types';

export const CHANNEL_QUERY = gql`
  query ChannelQuery($id: ID!) {
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
}): Promise<Channel> => {
  const data: { storage: { channel: Channel } } = await graphQLClient.request(
    CHANNEL_QUERY,
    variables,
  );

  return data?.storage.channel
    ? {
        ...data.storage.channel,
        transactions: data?.storage.channel.transactions.map(
          (transaction: Transaction) => {
            return {
              ...transaction,
              dataObject: JSON.parse(transaction.data),
            };
          },
        ),
      }
    : { id: '', topics: [], transactions: [] };
};

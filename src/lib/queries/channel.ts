/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { Channel, Transaction } from "../types";

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
    storage_sepolia {
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
  const data: {
    storage: { channel: Channel };
    storage_sepolia: { channel: Channel };
  } = await graphQLClient.request(CHANNEL_QUERY, variables);

  // Check which storage has the channel
  if (data?.storage?.channel) {
    return {
      ...data.storage.channel,
      source: "storage",
      transactions: data.storage.channel.transactions.map(
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
  }

  if (data?.storage_sepolia?.channel) {
    return {
      ...data.storage_sepolia.channel,
      source: "storage_sepolia",
      transactions: data.storage_sepolia.channel.transactions.map(
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
  }

  return null;
};

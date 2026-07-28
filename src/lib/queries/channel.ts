/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { Channel, Transaction } from "../types";

type ChannelSource = "storage" | "storage_sepolia";

const CHANNEL_SOURCES: readonly ChannelSource[] = [
  "storage",
  "storage_sepolia",
];

/**
 * Builds a single-remote channel query.
 *
 * Hasura returns `data: null` for the WHOLE document when any remote schema
 * errors, so querying `storage` and `storage_sepolia` in one document meant an
 * unhealthy sepolia remote took down server rendering of a healthy mainnet
 * request. One document per remote isolates that failure.
 */
const buildChannelQuery = (source: ChannelSource) => gql`
  query ChannelQuery($id: ID!) @cached {
    ${source} {
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

export const CHANNEL_QUERY = buildChannelQuery("storage");
const CHANNEL_SEPOLIA_QUERY = buildChannelQuery("storage_sepolia");

const CHANNEL_QUERIES: Record<ChannelSource, string> = {
  storage: CHANNEL_QUERY,
  storage_sepolia: CHANNEL_SEPOLIA_QUERY,
};

const formatChannel = (channel: Channel, source: ChannelSource): Channel => ({
  ...channel,
  source,
  transactions: channel.transactions.map((transaction: Transaction) => {
    try {
      return {
        ...transaction,
        dataObject: JSON.parse(transaction.data),
      };
    } catch (error: any) {
      console.error(`Error parsing transaction data: ${error.message}`);
      return transaction;
    }
  }),
});

/**
 * Fetches a channel from both storage remotes independently.
 *
 * `null` means a hard "this request does not exist" (the caller turns it into
 * `notFound()` + `noindex`), so it is only returned when EVERY remote answered
 * successfully and none of them had the channel. If the channel was not found
 * but a remote failed, "absent" and "unknown" are indistinguishable, so we
 * throw and let the error boundary handle it rather than telling a crawler a
 * possibly-live request does not exist.
 */
export const fetchRequest = async (variables: {
  id: string;
}): Promise<Channel | null> => {
  const results = await Promise.allSettled(
    CHANNEL_SOURCES.map((source) =>
      graphQLClient.request<{ [x: string]: { channel: Channel | null } }>(
        CHANNEL_QUERIES[source],
        variables,
      ),
    ),
  );

  const failedSources: string[] = [];

  for (let index = 0; index < CHANNEL_SOURCES.length; index++) {
    const source = CHANNEL_SOURCES[index];
    const result = results[index];

    if (result.status === "rejected") {
      failedSources.push(source);
      console.error(`fetchRequest: ${source} query failed`, result.reason);
      continue;
    }

    const channel = result.value?.[source]?.channel;
    if (channel) {
      return formatChannel(channel, source);
    }
  }

  if (failedSources.length > 0) {
    throw new Error(
      `fetchRequest: channel ${variables.id} not found, but ${failedSources.length} of ${CHANNEL_SOURCES.length} storage queries failed (${failedSources.join(", ")}) — cannot tell "absent" from "unavailable"`,
    );
  }

  return null;
};

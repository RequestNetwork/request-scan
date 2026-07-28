/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { SingleRequestProxyDeployment } from "../types";

export const CORE_PAYMENT_FIELDS = gql`
  fragment PaymentFields on Payment {
    currency
    amount
    amountInCrypto
    block
    contractAddress
    feeAddress
    feeAmount
    feeAmountInCrypto
    from
    gasPrice
    gasUsed
    id
    maxRateTimespan
    reference
    timestamp
    to
    tokenAddress
    txHash
  }
`;

/**
 * Runs one GraphQL request per chain remote instead of a single document that
 * aliases every chain at once.
 *
 * Hasura returns `data: null` for the WHOLE document when any remote schema
 * errors or is unavailable, so a single unhealthy subgraph used to wipe out the
 * data of every healthy chain. Splitting the fan-out isolates that failure:
 * rejected chains are logged and skipped, and the merged result keeps whatever
 * the healthy chains returned.
 *
 * The merged object has the same shape as the old combined response (one entry
 * per `payment_*` alias), so the existing `formatPaymentData` /
 * `formatProxyDeploymentData` merge + sort logic is reused untouched.
 *
 * If EVERY chain fails the error is rethrown: a total outage must stay
 * distinguishable from "there is no data", so react-query reports `error`
 * instead of rendering an empty table.
 */
export const requestPerChain = async <T>(
  label: string,
  chains: readonly string[],
  buildQuery: (chain: string) => string,
  variables: Record<string, unknown>,
): Promise<{ [x: string]: T }> => {
  const results = await Promise.allSettled(
    chains.map((chain) =>
      graphQLClient.request<{ [x: string]: T }>(buildQuery(chain), variables),
    ),
  );

  const merged: { [x: string]: T } = {};
  const failedChains: string[] = [];

  results.forEach((result, index) => {
    const chain = chains[index];

    if (result.status === "rejected") {
      failedChains.push(chain);
      console.error(`${label}: skipping chain ${chain}`, result.reason);
      return;
    }

    const chainData = result.value?.[chain];
    if (!chainData) {
      failedChains.push(chain);
      console.error(`${label}: skipping chain ${chain}, no data returned`);
      return;
    }

    merged[chain] = chainData;
  });

  if (chains.length > 0 && failedChains.length === chains.length) {
    throw new Error(
      `${label}: all ${chains.length} chain queries failed (${failedChains.join(", ")})`,
    );
  }

  return merged;
};

export const CORE_PROXY_DEPLOYMENT_FIELDS = gql`
  fragment ProxyDeploymentFields on SingleRequestProxyDeployment {
    id
    feeAddress
    feeAmount
    feeProxyUsed
    payee
    paymentReference
    proxyAddress
    proxyType
    timestamp
    tokenAddress
    txHash
  }
`;

export const formatProxyDeploymentData = (
  data: {
    [x: string]: {
      singleRequestProxyDeployments: SingleRequestProxyDeployment[];
    };
  } | null,
) => {
  if (!data) return [];

  const deployments: SingleRequestProxyDeployment[] = [];
  Object.keys(data).forEach((key) => {
    const networkName = key.replace("payment_", "");
    const networkDeployments = data[key].singleRequestProxyDeployments.map(
      (deployment) => ({
        ...deployment,
        chain: networkName,
      }),
    );
    deployments.push(...networkDeployments);
  });

  return deployments.sort((a, b) => b.timestamp - a.timestamp);
};

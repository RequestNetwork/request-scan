/** @format */

import { gql } from "graphql-request";
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
  } | null
) => {
  if (!data) return [];

  const deployments: SingleRequestProxyDeployment[] = [];
  Object.keys(data).forEach((key) => {
    const networkName = key.replace("payment_", "");
    const networkDeployments = data[key].singleRequestProxyDeployments.map(
      (deployment) => ({
        ...deployment,
        chain: networkName,
      })
    );
    deployments.push(...networkDeployments);
  });

  return deployments.sort((a, b) => b.timestamp - a.timestamp);
};

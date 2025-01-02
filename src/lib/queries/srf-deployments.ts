import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { SingleRequestProxyDeployment } from "../types";
import { formatProxyDeploymentData } from "../utils";
import { CORE_PROXY_DEPLOYMENT_FIELDS } from "./utils";

const DEPLOYMENT_PARAMS_FRAGMENT = gql`
  fragment DeploymentParams on SingleRequestProxyDeployment {
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

export const PROXY_DEPLOYMENTS_QUERY = gql`
  ${CORE_PROXY_DEPLOYMENT_FIELDS}
  query ProxyDeploymentsQuery($first: Int!, $skip: Int!) {
    payment_mainnet {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_arbitrum_one {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_avalanche {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_base {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_bsc {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_celo {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_matic {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_optimism {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_sepolia {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_xdai {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
    payment_zksyncera {
      singleRequestProxyDeployments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...ProxyDeploymentFields
      }
    }
  }
`;

export const fetchProxyDeployments = async (variables: {
  first: number;
  skip: number;
}): Promise<SingleRequestProxyDeployment[]> => {
  try {
    const data: {
      [x: string]: {
        singleRequestProxyDeployments: SingleRequestProxyDeployment[];
      };
    } = await graphQLClient.request(PROXY_DEPLOYMENTS_QUERY, variables);

    return formatProxyDeploymentData(data);
  } catch (error) {
    console.error("Error fetching proxy deployments:", error);
    throw error;
  }
};

export const PROXY_DEPLOYMENTS_BY_REFERENCE_QUERY = gql`
  ${CORE_PROXY_DEPLOYMENT_FIELDS}
  query ProxyDeploymentsByReferenceQuery($reference: Bytes!) {
    payment_mainnet {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_arbitrum_one {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_avalanche {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_base {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_bsc {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_celo {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_matic {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_optimism {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_sepolia {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_xdai {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
    payment_zksyncera {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
  }
`;

export const fetchProxyDeploymentsByReference = async (variables: {
  reference: string;
}): Promise<SingleRequestProxyDeployment[]> => {
  try {
    const data = await graphQLClient.request(
      PROXY_DEPLOYMENTS_BY_REFERENCE_QUERY,
      variables
    );

    return formatProxyDeploymentData(data);
  } catch (err) {
    console.error("Error fetching proxy deployments by reference", err);
    return [];
  }
};

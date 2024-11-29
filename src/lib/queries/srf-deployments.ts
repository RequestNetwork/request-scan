import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { SingleRequestProxyDeployment } from "../types";
import { formatProxyDeploymentData } from "../utils";
import { CORE_PROXY_DEPLOYMENT_FIELDS } from "./utils";

export const PROXY_DEPLOYMENTS_QUERY = gql`
  ${CORE_PROXY_DEPLOYMENT_FIELDS}
  query ProxyDeploymentsQuery($first: Int, $skip: Int!) {
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
  const data: {
    [x: string]: {
      singleRequestProxyDeployments: SingleRequestProxyDeployment[];
    };
  } = await graphQLClient.request(PROXY_DEPLOYMENTS_QUERY, variables);

  return formatProxyDeploymentData(data);
};

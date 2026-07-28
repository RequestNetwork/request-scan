import { gql } from "graphql-request";
import { SRF_CHAIN_REMOTES } from "../consts";
import type { SingleRequestProxyDeployment } from "../types";
import { formatProxyDeploymentData } from "../utils";
import { CORE_PROXY_DEPLOYMENT_FIELDS, requestPerChain } from "./utils";

type ProxyDeploymentsResult = {
  singleRequestProxyDeployments: SingleRequestProxyDeployment[];
};

export const buildProxyDeploymentsQuery = (chain: string) => gql`
  ${CORE_PROXY_DEPLOYMENT_FIELDS}
  query ProxyDeploymentsQuery($first: Int!, $skip: Int!) {
    ${chain} {
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
  const data = await requestPerChain<ProxyDeploymentsResult>(
    "fetchProxyDeployments",
    SRF_CHAIN_REMOTES,
    buildProxyDeploymentsQuery,
    variables,
  );

  return formatProxyDeploymentData(data);
};

export const buildProxyDeploymentsByReferenceQuery = (chain: string) => gql`
  ${CORE_PROXY_DEPLOYMENT_FIELDS}
  query ProxyDeploymentsByReferenceQuery($reference: Bytes!) {
    ${chain} {
      singleRequestProxyDeployments(where: { paymentReference: $reference }) {
        ...ProxyDeploymentFields
      }
    }
  }
`;

export const fetchProxyDeploymentsByReference = async (variables: {
  reference: string;
}): Promise<SingleRequestProxyDeployment[]> => {
  const data = await requestPerChain<ProxyDeploymentsResult>(
    "fetchProxyDeploymentsByReference",
    SRF_CHAIN_REMOTES,
    buildProxyDeploymentsByReferenceQuery,
    variables,
  );

  return formatProxyDeploymentData(data);
};

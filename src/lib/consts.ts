/** @format */

import { http, createPublicClient } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  fantom,
  fuse,
  gnosis,
  mainnet,
  moonbeam,
  optimism,
  polygon,
  sepolia,
  zksync,
} from "viem/chains";

export const CHAINS = {
  MAINNET: "mainnet",
  ARBITRUM_ONE: "arbitrum_one",
  AVALANCHE: "avalanche",
  BASE: "base",
  BSC: "bsc",
  CELO: "celo",
  FANTOM: "fantom",
  FUSE: "fuse",
  MATIC: "matic",
  MOONBEAM: "moonbeam",
  OPTIMISM: "optimism",
  SEPOLIA: "sepolia",
  XDAI: "xdai",
  ZKSYNCERA: "zksyncera",
};

export const CHAIN_SCAN_URLS = {
  [CHAINS.MAINNET]: "https://etherscan.io",
  [CHAINS.ARBITRUM_ONE]: "https://arbiscan.io",
  [CHAINS.AVALANCHE]: "https://cchain.explorer.avax.network",
  [CHAINS.BASE]: "https://basescan.org",
  [CHAINS.BSC]: "https://bscscan.com",
  [CHAINS.CELO]: "https://explorer.celo.org",
  [CHAINS.FANTOM]: "https://ftmscan.com",
  [CHAINS.FUSE]: "https://explorer.fuse.io",
  [CHAINS.MATIC]: "https://explorer-mainnet.maticvigil.com",
  [CHAINS.MOONBEAM]: "https://moonbeam-explorer.netlify.app",
  [CHAINS.OPTIMISM]: "https://optimistic.etherscan.io",
  [CHAINS.SEPOLIA]: "https://sepolia.etherscan.io",
  [CHAINS.XDAI]: "https://gnosisscan.io",
  [CHAINS.ZKSYNCERA]: "https://explorer.zksync.io",
};

export enum PAYMENT_CHAINS {
  MAINNET = "payment_mainnet",
  ARBITRUM_ONE = "payment_arbitrum_one",
  AVALANCHE = "payment_avalanche",
  BASE = "payment_base",
  BSC = "payment_bsc",
  CELO = "payment_celo",
  FANTOM = "payment_fantom",
  FUSE = "payment_fuse",
  MATIC = "payment_matic",
  MOONBEAM = "payment_moonbeam",
  OPTIMISM = "payment_optimism",
  SEPOLIA = "payment_sepolia",
  XDAI = "payment_xdai",
  ZKSYNCERA = "payment_zksyncera",
}

/**
 * Every payment subgraph remote, used to fan out the payment queries one
 * request per chain.
 */
export const PAYMENT_CHAIN_REMOTES: readonly PAYMENT_CHAINS[] =
  Object.values(PAYMENT_CHAINS);

/**
 * Remotes that expose the `singleRequestProxyDeployments` entity.
 *
 * This is intentionally NOT `PAYMENT_CHAIN_REMOTES`: the Single Request
 * Forwarder subgraphs are only deployed on a subset of chains, and
 * `payment_zksyncera` in particular has no `singleRequestProxyDeployments`
 * field at all, so querying it always fails with
 * `field 'singleRequestProxyDeployments' not found in type: 'payment_zksynceraQuery'`.
 */
export const SRF_CHAIN_REMOTES: readonly PAYMENT_CHAINS[] = [
  PAYMENT_CHAINS.MAINNET,
  PAYMENT_CHAINS.ARBITRUM_ONE,
  PAYMENT_CHAINS.AVALANCHE,
  PAYMENT_CHAINS.BASE,
  PAYMENT_CHAINS.BSC,
  PAYMENT_CHAINS.CELO,
  PAYMENT_CHAINS.MATIC,
  PAYMENT_CHAINS.OPTIMISM,
  PAYMENT_CHAINS.SEPOLIA,
  PAYMENT_CHAINS.XDAI,
];

export const PUBLIC_CLIENTS = {
  [CHAINS.MAINNET]: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  [CHAINS.ARBITRUM_ONE]: createPublicClient({
    chain: arbitrum,
    transport: http(),
  }),
  [CHAINS.AVALANCHE]: createPublicClient({
    chain: avalanche,
    transport: http(),
  }),
  [CHAINS.BASE]: createPublicClient({
    chain: base,
    transport: http(),
  }),
  [CHAINS.BSC]: createPublicClient({
    chain: bsc,
    transport: http(),
  }),
  [CHAINS.CELO]: createPublicClient({
    chain: celo,
    transport: http(),
  }),
  [CHAINS.FANTOM]: createPublicClient({
    chain: fantom,
    transport: http(),
  }),
  [CHAINS.FUSE]: createPublicClient({
    chain: fuse,
    transport: http(),
  }),
  [CHAINS.MATIC]: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  [CHAINS.MOONBEAM]: createPublicClient({
    chain: moonbeam,
    transport: http(),
  }),
  [CHAINS.OPTIMISM]: createPublicClient({
    chain: optimism,
    transport: http(),
  }),
  [CHAINS.SEPOLIA]: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
  [CHAINS.XDAI]: createPublicClient({
    chain: gnosis,
    transport: http(),
  }),
  [CHAINS.ZKSYNCERA]: createPublicClient({
    chain: zksync,
    transport: http(),
  }),
};

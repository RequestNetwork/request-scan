/** @format */

import { createPublicClient, http } from 'viem';
import {
  arbitrum,
  avalanche,
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
} from 'viem/chains';

export const CHAINS = {
  MAINNET: 'mainnet',
  ARBITRUM_ONE: 'arbitrum_one',
  AVALANCHE: 'avalanche',
  BSC: 'bsc',
  CELO: 'celo',
  FANTOM: 'fantom',
  FUSE: 'fuse',
  MATIC: 'matic',
  MOONBEAM: 'moonbeam',
  OPTIMISM: 'optimism',
  SEPOLIA: 'sepolia',
  XDAI: 'xdai',
  ZKSYNCERA: 'zksyncera',
};

export const CHAIN_SCAN_URLS = {
  [CHAINS.MAINNET]: 'https://etherscan.io',
  [CHAINS.ARBITRUM_ONE]: 'https://arbiscan.io',
  [CHAINS.AVALANCHE]: 'https://cchain.explorer.avax.network',
  [CHAINS.BSC]: 'https://bscscan.com',
  [CHAINS.CELO]: 'https://explorer.celo.org',
  [CHAINS.FANTOM]: 'https://ftmscan.com',
  [CHAINS.FUSE]: 'https://explorer.fuse.io',
  [CHAINS.MATIC]: 'https://explorer-mainnet.maticvigil.com',
  [CHAINS.MOONBEAM]: 'https://moonbeam-explorer.netlify.app',
  [CHAINS.OPTIMISM]: 'https://optimistic.etherscan.io',
  [CHAINS.SEPOLIA]: 'https://sepolia.etherscan.io',
  [CHAINS.XDAI]: 'https://gnosisscan.io',
  [CHAINS.ZKSYNCERA]: 'https://explorer.zksync.io',
};

export enum PAYMENT_CHAINS {
  MAINNET = 'payment_mainnet',
  ARBITRUM_ONE = 'payment_arbitrum_one',
  AVALANCHE = 'payment_avalanche',
  BSC = 'payment_bsc',
  CELO = 'payment_celo',
  FANTOM = 'payment_fantom',
  FUSE = 'payment_fuse',
  MATIC = 'payment_matic',
  MOONBEAM = 'payment_moonbeam',
  OPTIMISM = 'payment_optimism',
  SEPOLIA = 'payment_sepolia',
  XDAI = 'payment_xdai',
  ZKSYNCERA = 'payment_zksyncera',
}

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

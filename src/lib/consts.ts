/** @format */

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
  [CHAINS.XDAI]: 'https://blockscout.com/xdai/mainnet',
  [CHAINS.ZKSYNCERA]: 'https://zkscan.io',
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
  XDAI = 'payment_xdai',
  ZKSYNCERA = 'payment_zksyncera',
}

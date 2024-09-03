/** @format */

export interface Payment {
  amount: string;
  amountInCrypto: string;
  block: number;
  contractAddress: string;
  currency: string;
  feeAddress: string;
  feeAmount: string;
  feeAmountInCrypto: string;
  from: string;
  gasPrice: string;
  gasUsed: string;
  id: string;
  maxRateTimespan: number;
  reference: string;
  timestamp: number;
  to: string;
  tokenAddress: string;
  txHash: string;
  chain: string;
}

export interface Transaction {
  blockNumber: number;
  blockTimestamp: number;
  channelId: string;
  data: string;
  dataObject: any;
  dataHash: string;
  hash: string;
  id: string;
  size: string;
  smartContractAddress: string;
}

export interface Channel {
  id: string;
  topics: string[];
  transactions: Transaction[];
}

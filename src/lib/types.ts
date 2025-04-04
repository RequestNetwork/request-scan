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
  encryptedData?: string;
  encryptedKeys?: string;
  encryptionMethod?: string;
  publicKeys?: string;
  hash: string;
  id: string;
  size: string;
  smartContractAddress: string;
  network?: "gnosis" | "sepolia";
}

export interface SingleRequestProxyDeployment {
  id: string;
  feeAddress: string;
  feeAmount: string;
  feeProxyUsed: boolean;
  payee: string;
  paymentReference: string;
  proxyAddress: string;
  proxyType: string;
  timestamp: number;
  tokenAddress: string;
  txHash: string;
  chain: string;
}

export interface Channel {
  id: string;
  topics: string[];
  transactions: Transaction[];
  source?: "storage" | "storage_sepolia";
}
export interface PaymentData {
  acceptedTokens: string[];
  network: string;
}

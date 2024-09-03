/** @format */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as timeago from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';
import { erc20Abi, formatUnits, isAddress, keccak256 } from 'viem';
import { currencyManager } from './currency-manager';
import { keccak256Hash } from '@requestnetwork/utils';
import { CHAINS, PUBLIC_CLIENTS } from './consts';
import { Payment } from './types';

timeago.register('en_short', en_short);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const groupBy = (items: any, key: any) =>
  items.reduce((result: any, item: any) => {
    if (!result[item[key]]) {
      result[item[key]] = [];
    }
    result[item[key]].push(item);
    return result;
  }, {});

export const formatTimestamp = (timestamp: number) =>
  `${new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
  })} UTC`;

export const getAmountWithCurrencySymbol = (
  amount: bigint,
  currency: string,
  network: string,
) => {
  let currencyDetails: { symbol: string; decimals: number } | undefined =
    isAddress(currency)
      ? currencyManager.fromAddress(currency)
      : currencyManager.fromSymbol(currency);

  // ISSUE: https://github.com/wevm/wagmi/issues/3128
  // if (!currencyDetails) {
  //   try {
  //     const symbol = await PUBLIC_CLIENTS[network].readContract({
  //       address: currency as `0x${string}`,
  //       abi: erc20Abi,
  //       functionName: 'symbol',
  //     });
  //     const decimals = await PUBLIC_CLIENTS[network].readContract({
  //       address: currency as `0x${string}`,
  //       abi: erc20Abi,
  //       functionName: 'decimals',
  //     });

  //     currencyDetails = {
  //       symbol,
  //       decimals,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching currency details', error);
  //     return formatUnits(amount, 18);
  //   }
  // }

  return `${formatUnits(amount, currencyDetails?.decimals || 18)} ${currencyDetails?.symbol || ''}`;
};

/**
 * Compute the payment reference
 *
 * @param requestId The requestId
 * @param salt The salt for the request
 * @param address Payment or refund address
 */

export function calculatePaymentReference(
  requestId: string,
  salt: string,
  address: string,
): string {
  if (!requestId || !salt || !address) {
    throw new Error(
      'RequestId, salt and address are mandatory to calculate the payment reference',
    );
  }
  // "The value is the last 8 bytes of a salted hash of the requestId: `last8Bytes(hash(requestId + salt + address))`"
  return keccak256(
    `0x${keccak256Hash((requestId + salt + address).toLowerCase()).slice(-16)}`,
  );
}

export const formatPaymentData = (
  data: {
    [x: string]: { payments: Payment[] };
  } | null,
) => {
  return data
    ? [
        ...data.payment_mainnet.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MAINNET };
        }),
        ...data.payment_arbitrum_one.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ARBITRUM_ONE };
        }),
        ...data.payment_avalanche.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.AVALANCHE };
        }),
        ...data.payment_bsc.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.BSC };
        }),
        ...data.payment_celo.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.CELO };
        }),
        ...data.payment_fantom.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FANTOM };
        }),
        ...data.payment_fuse.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FUSE };
        }),
        ...data.payment_matic.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MATIC };
        }),
        ...data.payment_moonbeam.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MOONBEAM };
        }),
        ...data.payment_optimism.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.OPTIMISM };
        }),
        ...data.payment_xdai.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.XDAI };
        }),
        ...data.payment_zksyncera.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ZKSYNCERA };
        }),
      ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
    : [];
};

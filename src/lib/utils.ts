/** @format */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as timeago from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';
import { formatUnits, isAddress, keccak256 } from 'viem';
import { currencyManager } from './currency-manager';
import { CHAINS } from './consts';
import { Payment } from './types';
import { keepPreviousData } from '@tanstack/react-query';
import { PaymentReferenceCalculator } from '@requestnetwork/request-client.js';

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
) => {
  const currencyDetails: { symbol: string; decimals: number } | undefined =
    isAddress(currency)
      ? currencyManager.fromAddress(currency)
      : currencyManager.fromSymbol(currency);

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
  const shortPaymenReference = PaymentReferenceCalculator.calculate(
    requestId,
    salt,
    address,
  );
  return keccak256(`0x${shortPaymenReference}`);
}

const mapPaymentToChain = (payment: Payment, chain: string) => ({
  ...payment,
  chain,
});

export const formatPaymentData = (
  data: {
    [x: string]: { payments: Payment[] };
  } | null,
) => {
  return data
    ? [
        ...data.payment_mainnet.payments.map((payment) =>
          mapPaymentToChain(payment, CHAINS.MAINNET),
        ),
        ...data.payment_arbitrum_one.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.ARBITRUM_ONE),
        ),
        ...data.payment_avalanche.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.AVALANCHE),
        ),
        ...data.payment_bsc.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.BSC),
        ),
        ...data.payment_celo.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.CELO),
        ),
        ...data.payment_fantom.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.FANTOM),
        ),
        ...data.payment_fuse.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.FUSE),
        ),

        ...data.payment_matic.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.MATIC),
        ),
        ...data.payment_moonbeam.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.MOONBEAM),
        ),
        ...data.payment_optimism.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.OPTIMISM),
        ),
        ...data.payment_sepolia.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.SEPOLIA),
        ),
        ...data.payment_xdai.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.XDAI),
        ),
        ...data.payment_zksyncera.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.ZKSYNCERA),
        ),
      ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
    : [];
};

export const commonQueryOptions = {
  refetchInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
  placeholderData: keepPreviousData,
  staleTime: 1000 * 30,
};

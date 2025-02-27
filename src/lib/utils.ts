/** @format */

import type { ActorInfo, Invoice } from "@requestnetwork/data-format";
import { PaymentReferenceCalculator } from "@requestnetwork/request-client.js";
import type { RequestLogicTypes } from "@requestnetwork/types";
import { keepPreviousData } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as timeago from "timeago.js";
import en_short from "timeago.js/lib/lang/en_short";
import truncateEthAddress from "truncate-eth-address";
import { formatUnits, isAddress, keccak256 } from "viem";
import { CHAINS } from "./consts";
import { currencyManager } from "./currency-manager";
import type {
  Payment,
  SingleRequestProxyDeployment,
  Transaction,
} from "./types";

timeago.register("en_short", en_short);

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
  `${new Date(timestamp * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  })} UTC`;

export const getAmountWithCurrencySymbol = (
  amount: bigint,
  currency: string
) => {
  const currencyDetails: { symbol: string; decimals: number } | undefined =
    currency && isAddress(currency)
      ? currencyManager.fromAddress(currency)
      : currency
        ? currencyManager.fromSymbol(currency)
        : undefined;

  return `${formatUnits(amount, currencyDetails?.decimals || 18)} ${currencyDetails?.symbol || ""}`.trim();
};

/**
 * Compute the payment reference
 *
 * @param requestId The requestId
 * @param salt The salt for the request
 * @param address Payment or refund address
 * @returns A string starting with '0x' if successful, or undefined if an error occurs during calculation.
 */
export function calculateShortPaymentReference(
  requestId: string,
  salt: string,
  address: string
): `0x${string}` | undefined {
  try {
    return `0x${PaymentReferenceCalculator.calculate(requestId, salt, address)}`;
  } catch (error) {
    console.error("Error calculating short payment reference", error);
    return undefined;
  }
}

export const calculateLongPaymentReference = (
  shortPaymentReference: `0x${string}`
) => {
  return keccak256(shortPaymentReference);
};

// Helper type for payment data structure
type PaymentDataStructure = {
  [K in `payment_${keyof typeof CHAINS}`]?: { payments: Payment[] };
};

type ProxyDeploymentDataStructure = {
  [K in `payment_${keyof typeof CHAINS}`]?: {
    singleRequestProxyDeployments: SingleRequestProxyDeployment[];
  };
};

const mapPaymentToChain = (payment: Payment, chain: string) => ({
  ...payment,
  chain,
});

export const formatPaymentData = (data: PaymentDataStructure | null) => {
  if (!data) return [];

  const chainEntries = Object.entries(data).filter(([key]) =>
    key.startsWith("payment_")
  );

  return chainEntries
    .flatMap(([key, value]) => {
      const chainName = key
        .replace("payment_", "")
        .toUpperCase() as keyof typeof CHAINS;
      return (
        value?.payments.map((payment) =>
          mapPaymentToChain(payment, CHAINS[chainName])
        ) || []
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const formatProxyDeploymentData = (
  data: ProxyDeploymentDataStructure | null
) => {
  if (!data) return [];

  const chainEntries = Object.entries(data).filter(([key]) =>
    key.startsWith("payment_")
  );

  return chainEntries
    .flatMap(([key, value]) => {
      const chainName = key
        .replace("payment_", "")
        .toUpperCase() as keyof typeof CHAINS;
      return (
        value?.singleRequestProxyDeployments.map((deployment) => ({
          ...deployment,
          chain: CHAINS[chainName],
        })) || []
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const commonQueryOptions = {
  refetchInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
  placeholderData: keepPreviousData,
  staleTime: 1000 * 30,
};

export const getTransactionCreateParameters = (
  transaction: Transaction
): RequestLogicTypes.ICreateParameters => {
  return transaction?.dataObject?.data
    ?.parameters as RequestLogicTypes.ICreateParameters;
};

export const getContentDataFromCreateTransaction = (
  createParameters: RequestLogicTypes.ICreateParameters
) => {
  const extensionData = createParameters.extensionsData;
  const contentData: Invoice = extensionData?.find(
    (extension) => extension.id === "content-data"
  )?.parameters?.content;

  return contentData;
};

export const getPaymentDataFromCreateTransaction = (
  createParameters: RequestLogicTypes.ICreateParameters
) => {
  const extensionData = createParameters?.extensionsData!;
  return extensionData[0]?.parameters;
};

export const getBalance = (payments: Payment[] | undefined) => {
  return payments
    ? payments
        .map((payment) =>
          BigInt(payment?.amount || payment?.amountInCrypto || "0")
        )
        .reduce((a, b) => a + b, BigInt(0))
    : BigInt(0);
};

export const renderAddress = (info: ActorInfo | undefined) => {
  const parts = [
    info?.address?.["street-address"],
    info?.address?.locality,
    info?.address?.["postal-code"],
    info?.address?.["country-name"],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "-";
};

export const safeTruncateEthAddress = (address: string) =>
  truncateEthAddress(address || "");

export const capitalize = (str: string) =>
  (str && str[0].toUpperCase() + str.slice(1)) || "";

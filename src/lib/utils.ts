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
    isAddress(currency)
      ? currencyManager.fromAddress(currency)
      : currencyManager.fromSymbol(currency);

  return `${formatUnits(amount, currencyDetails?.decimals || 18)} ${currencyDetails?.symbol || ""}`;
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

const mapPaymentToChain = (payment: Payment, chain: string) => ({
  ...payment,
  chain,
});

export const formatPaymentData = (
  data: {
    [x: string]: { payments: Payment[] };
  } | null
) => {
  return data
    ? [
        ...data.payment_mainnet.payments.map((payment) =>
          mapPaymentToChain(payment, CHAINS.MAINNET)
        ),
        ...data.payment_arbitrum_one.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.ARBITRUM_ONE)
        ),
        ...data.payment_avalanche.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.AVALANCHE)
        ),
        ...data.payment_base.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.BASE)
        ),
        ...data.payment_bsc.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.BSC)
        ),
        ...data.payment_celo.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.CELO)
        ),
        ...data.payment_fantom.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.FANTOM)
        ),
        ...data.payment_fuse.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.FUSE)
        ),

        ...data.payment_matic.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.MATIC)
        ),
        ...data.payment_moonbeam.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.MOONBEAM)
        ),
        ...data.payment_optimism.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.OPTIMISM)
        ),
        ...data.payment_sepolia.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.SEPOLIA)
        ),
        ...data.payment_xdai.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.XDAI)
        ),
        ...data.payment_zksyncera.payments.map((payment: any) =>
          mapPaymentToChain(payment, CHAINS.ZKSYNCERA)
        ),
      ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
    : [];
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
        .map((payment) => BigInt(payment?.amount || payment?.amountInCrypto || '0'))
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

export const formatProxyDeploymentData = (
  data: {
    [x: string]: {
      singleRequestProxyDeployments: SingleRequestProxyDeployment[];
    };
  } | null
) => {
  if (!data) return [];

  console.log("Data received in formatter:", data); // Debug log

  const deployments: SingleRequestProxyDeployment[] = [];
  Object.keys(data).forEach((key) => {
    if (data[key]?.singleRequestProxyDeployments?.length > 0) {
      const networkName = key.replace("payment_", "");
      const networkDeployments = data[key].singleRequestProxyDeployments.map(
        (deployment) => ({
          ...deployment,
          chain: networkName,
        })
      );
      deployments.push(...networkDeployments);
    }
  });

  console.log("Deployments after formatting:", deployments); // Debug log

  return deployments.sort((a, b) => b.timestamp - a.timestamp);
};

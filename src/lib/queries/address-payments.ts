/** @format */

import { gql } from "graphql-request";
import { PAYMENT_CHAIN_REMOTES } from "../consts";
import type { Payment } from "../types";
import { formatPaymentData } from "../utils";
import { CORE_PAYMENT_FIELDS, requestPerChain } from "./utils";

export const buildAddressPaymentsQuery = (chain: string) => gql`
  ${CORE_PAYMENT_FIELDS}
  query AddressPaymentsQuery($first: Int, $skip: Int!, $address: Bytes) {
    ${chain} {
      payments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
      ) {
        ...PaymentFields
      }
    }
  }
`;

export const fetchAddressPayments = async (variables: {
  first: number;
  skip: number;
  address: string;
}): Promise<Payment[]> => {
  try {
    const data = await requestPerChain<{ payments: Payment[] }>(
      "fetchAddressPayments",
      PAYMENT_CHAIN_REMOTES,
      buildAddressPaymentsQuery,
      variables,
    );

    return formatPaymentData(data);
  } catch (error: any) {
    console.error("Error fetching address payments:", error);
    throw error;
  }
};

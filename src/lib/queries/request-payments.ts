/** @format */

import { gql } from "graphql-request";
import { PAYMENT_CHAIN_REMOTES } from "../consts";
import type { Payment } from "../types";
import { formatPaymentData } from "../utils";
import { CORE_PAYMENT_FIELDS, requestPerChain } from "./utils";

export const buildRequestPaymentsQuery = (chain: string) => gql`
  ${CORE_PAYMENT_FIELDS}

  query RequestPaymentsQuery($reference: Bytes!) @cached {
    ${chain} {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
  }
`;

export const fetchRequestPayments = async (variables: {
  reference: string;
}): Promise<Payment[]> => {
  try {
    if (!variables.reference) {
      return formatPaymentData(null);
    }

    const data = await requestPerChain<{ payments: Payment[] }>(
      "fetchRequestPayments",
      PAYMENT_CHAIN_REMOTES,
      buildRequestPaymentsQuery,
      variables,
    );

    return formatPaymentData(data);
  } catch (error) {
    console.error("fetchRequestPayments", error);
    throw error;
  }
};

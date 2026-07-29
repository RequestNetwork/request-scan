/** @format */

import { gql } from "graphql-request";
import { PAYMENT_CHAIN_REMOTES } from "../consts";
import type { Payment } from "../types";
import { formatPaymentData } from "../utils";
import { CORE_PAYMENT_FIELDS, requestPerChain } from "./utils";

export const buildPaymentsQuery = (chain: string) => gql`
  ${CORE_PAYMENT_FIELDS}
  query PaymentsQuery($first: Int, $skip: Int!) {
    ${chain} {
      payments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
  }
`;

export const fetchPayments = async (variables: {
  first: number;
  skip: number;
}): Promise<Payment[]> => {
  const data = await requestPerChain<{ payments: Payment[] }>(
    "fetchPayments",
    PAYMENT_CHAIN_REMOTES,
    buildPaymentsQuery,
    variables,
  );

  return formatPaymentData(data);
};

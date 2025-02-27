/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { Payment } from "../types";
import { formatPaymentData } from "../utils";
import { CORE_PAYMENT_FIELDS } from "./utils";

export const ADDRESS_PAYMENTS_QUERY = gql`
  ${CORE_PAYMENT_FIELDS}
  query AddressPaymentsQuery($first: Int, $skip: Int!, $address: Bytes) {
    payment_mainnet {
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
    payment_arbitrum_one {
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
    payment_avalanche {
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
    payment_base {
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
    payment_bsc {
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
    payment_celo {
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
    payment_fantom {
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
    payment_fuse {
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
    payment_matic {
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
    payment_moonbeam {
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
    payment_optimism {
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
    payment_sepolia {
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
    payment_xdai {
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
    payment_zksyncera {
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
    const data: { [x: string]: { payments: Payment[] } } =
      await graphQLClient.request(ADDRESS_PAYMENTS_QUERY, variables);

    return formatPaymentData(data);
  } catch (error: any) {
    console.error("Error fetching address payments:", error);
    throw error;
  }
};

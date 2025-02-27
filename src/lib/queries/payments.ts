/** @format */

import { gql } from "graphql-request";
import { graphQLClient } from "../graphQlClient";
import type { Payment } from "../types";
import { formatPaymentData } from "../utils";
import { CORE_PAYMENT_FIELDS } from "./utils";

export const PAYMENTS_QUERY = gql`
  ${CORE_PAYMENT_FIELDS}
  query PaymentsQuery($first: Int, $skip: Int!) {
    #
    payment_mainnet {
      payments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
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
  const data: { [x: string]: { payments: Payment[] } } =
    await graphQLClient.request(PAYMENTS_QUERY, variables);

  return formatPaymentData(data);
};

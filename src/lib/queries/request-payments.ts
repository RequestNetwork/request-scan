/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { formatPaymentData } from '../utils';
import { CORE_PAYMENT_FIELDS } from './utils';

export const REQUEST_PAYMENTS_QUERY = gql`
  ${CORE_PAYMENT_FIELDS}

  query RequestPaymentsQuery($reference: Bytes!) @cached {
    #
    payment_mainnet {
      payments(
        orderBy: timestamp
        orderDirection: desc
        where: { reference: $reference }
      ) {
        ...PaymentFields
      }
    }
    payment_arbitrum_one {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_avalanche {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_bsc {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_celo {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_fantom {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_fuse {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_matic {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_moonbeam {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_optimism {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_sepolia {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_xdai {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        ...PaymentFields
      }
    }
    payment_zksyncera {
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
    const data: { [x: string]: { payments: Payment[] } } | null =
      variables.reference
        ? await graphQLClient.request(REQUEST_PAYMENTS_QUERY, variables)
        : null;

    return formatPaymentData(data);
  } catch (error) {
    console.error('fetchRequestPayments', error);
    throw error;
  }
};

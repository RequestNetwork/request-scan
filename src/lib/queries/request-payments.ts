/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { formatPaymentData } from '../utils';

export const REQUEST_PAYMENTS_QUERY = gql`
  query RequestPaymentsQuery($reference: Bytes!) {
    #
    payment_mainnet {
      payments(
        orderBy: timestamp
        orderDirection: desc
        where: { reference: $reference }
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_arbitrum_one {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_avalanche {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_bsc {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_celo {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_fantom {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_fuse {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_matic {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_moonbeam {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_optimism {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_sepolia {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_xdai {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
    payment_zksyncera {
      payments(
        where: { reference: $reference }
        orderBy: timestamp
        orderDirection: desc
      ) {
        currency
        amount
        amountInCrypto
        block
        contractAddress
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasPrice
        gasUsed
        id
        maxRateTimespan
        reference
        timestamp
        to
        tokenAddress
        txHash
      }
    }
  }
`;

export const fetchRequestPayments = async (variables: {
  reference: string;
}): Promise<Payment[]> => {
  const data: { [x: string]: { payments: Payment[] } } | null =
    variables.reference
      ? await graphQLClient.request(REQUEST_PAYMENTS_QUERY, variables)
      : null;

  return formatPaymentData(data);
};

/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { formatPaymentData } from '../utils';

export const ADDRESS_PAYMENTS_QUERY = gql`
  query AddressPaymentsQuery($first: Int, $skip: Int!, $address: Bytes) {
    payment_mainnet {
      payments(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { or: [{ to: $address }, { from: $address }] }
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

export const fetchAddressPayments = async (variables: {
  first: number;
  skip: number;
  address: string;
}): Promise<Payment[]> => {
  const data: { [x: string]: { payments: Payment[] } } =
    await graphQLClient.request(ADDRESS_PAYMENTS_QUERY, variables);

  return formatPaymentData(data);
};

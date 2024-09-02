/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { CHAINS } from '../consts';

export const PAYMENTS_QUERY = gql`
  query PaymentsQuery($first: Int, $skip: Int!) {
    #
    payment_mainnet {
      payments(
        first: $first
        skip: $skip
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
    payment_arbitrum_one {
      payments(
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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
        first: $first
        skip: $skip
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

export const fetchPayments = async (variables: {
  first: number;
  skip: number;
}): Promise<Payment[]> => {
  console.log('fetchPayments');
  const data: { [x: string]: { payments: Payment[] } } =
    await graphQLClient.request(PAYMENTS_QUERY, variables);

  return data
    ? [
        ...data.payment_mainnet.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MAINNET };
        }),
        ...data.payment_arbitrum_one.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ARBITRUM_ONE };
        }),
        ...data.payment_avalanche.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.AVALANCHE };
        }),
        ...data.payment_bsc.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.BSC };
        }),
        ...data.payment_celo.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.CELO };
        }),
        ...data.payment_fantom.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FANTOM };
        }),
        ...data.payment_fuse.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FUSE };
        }),
        ...data.payment_matic.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MATIC };
        }),
        ...data.payment_moonbeam.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MOONBEAM };
        }),
        ...data.payment_optimism.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.OPTIMISM };
        }),
        ...data.payment_xdai.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.XDAI };
        }),
        ...data.payment_zksyncera.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ZKSYNCERA };
        }),
      ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
    : [];
};

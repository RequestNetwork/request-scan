/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { formatPaymentData } from '../utils';

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
    payment_sepolia {
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
  const data: { [x: string]: { payments: Payment[] } } =
    await graphQLClient.request(PAYMENTS_QUERY, variables);

  return formatPaymentData(data);
};

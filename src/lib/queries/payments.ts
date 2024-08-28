/** @format */

import { gql, DocumentNode } from '@apollo/client';

export const getPaymentsQuery = (paymentChain: String): DocumentNode =>
  gql`
  query PaymentsQuery($first: Int, $skip: Int!) {
    ${paymentChain} {
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

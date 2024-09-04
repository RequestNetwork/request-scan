/** @format */

import { gql } from 'graphql-request';

export const CORE_PAYMENT_FIELDS = gql`
  fragment PaymentFields on Payment {
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
`;

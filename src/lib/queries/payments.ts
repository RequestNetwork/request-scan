/** @format */

import { gql } from 'graphql-request';
import { Payment } from '../types';
import { graphQLClient } from '../graphQlClient';
import { CHAINS, PAYMENT_CHAINS } from '../consts';

export const getPaymentsQuery = (paymentChain: string) =>
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

export const fetchPayments = async (variables: {
  first: number;
  skip: number;
}): Promise<Payment[]> => {
  const mainnetData: { payment_mainnet: { payments: Payment[] } } =
    await graphQLClient.request(
      getPaymentsQuery(PAYMENT_CHAINS.MAINNET),
      variables,
    );
  const arbitrumOneData: {
    payment_arbitrum_one: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.ARBITRUM_ONE),
    variables,
  );
  const avalancheData: {
    payment_avalanche: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.AVALANCHE),
    variables,
  );
  const bscData: {
    payment_bsc: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.BSC),
    variables,
  );
  const celoData: {
    payment_celo: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.CELO),
    variables,
  );
  const fantomData: {
    payment_fantom: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.FANTOM),
    variables,
  );
  const fuseData: {
    payment_fuse: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.FUSE),
    variables,
  );
  const maticData: {
    payment_matic: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.MATIC),
    variables,
  );
  const moonbeamData: {
    payment_moonbeam: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.MOONBEAM),
    variables,
  );
  const optimismData: {
    payment_optimism: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.OPTIMISM),
    variables,
  );
  const xdaiData: {
    payment_xdai: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.XDAI),
    variables,
  );
  const zksynceraData: {
    payment_zksyncera: { payments: Payment[] };
  } = await graphQLClient.request(
    getPaymentsQuery(PAYMENT_CHAINS.ZKSYNCERA),
    variables,
  );

  return mainnetData &&
    arbitrumOneData &&
    avalancheData &&
    bscData &&
    celoData &&
    fantomData &&
    fuseData &&
    maticData &&
    moonbeamData &&
    optimismData &&
    xdaiData &&
    zksynceraData
    ? [
        ...mainnetData.payment_mainnet.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MAINNET };
        }),
        ...arbitrumOneData.payment_arbitrum_one.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ARBITRUM_ONE };
        }),
        ...avalancheData.payment_avalanche.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.AVALANCHE };
        }),
        ...bscData.payment_bsc.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.BSC };
        }),
        ...celoData.payment_celo.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.CELO };
        }),
        ...fantomData.payment_fantom.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FANTOM };
        }),
        ...fuseData.payment_fuse.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.FUSE };
        }),
        ...maticData.payment_matic.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MATIC };
        }),
        ...moonbeamData.payment_moonbeam.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.MOONBEAM };
        }),
        ...optimismData.payment_optimism.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.OPTIMISM };
        }),
        ...xdaiData.payment_xdai.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.XDAI };
        }),
        ...zksynceraData.payment_zksyncera.payments.map((payment: any) => {
          return { ...payment, chain: CHAINS.ZKSYNCERA };
        }),
      ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
    : [];
};

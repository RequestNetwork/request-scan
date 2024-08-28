/** @format */
'use client';

import React, { ReactNode, useContext, useMemo } from 'react';
import { Payment } from '../types';
import { CHAINS, PAYMENT_CHAINS } from '../consts';
import { useQuery } from '@apollo/client';
import { getPaymentsQuery } from '../queries/payments';

interface ILatestPaymentsContext {
  payments: Payment[];
  isLoading: boolean;
}

const LatestPaymentsContext = React.createContext<ILatestPaymentsContext>({
  payments: [],
  isLoading: false,
});

export const LatestPaymentsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const pollInterval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000;
  const first = 10;
  const skip = 0;

  const { data: mainnetData, loading: mainnetLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.MAINNET),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: arbitrumOneData, loading: arbitrumOneLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.ARBITRUM_ONE),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: avalancheData, loading: avalancheLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.AVALANCHE),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: bscData, loading: bscLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.BSC),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: celoData, loading: celoLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.CELO),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: fantomData, loading: fantomLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.FANTOM),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: fuseData, loading: fuseLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.FUSE),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: maticData, loading: maticLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.MATIC),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: moonbeamData, loading: moonbeamLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.MOONBEAM),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: optimismData, loading: optimismLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.OPTIMISM),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: xdaiData, loading: xdaiLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.XDAI),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const { data: zksynceraData, loading: zksynceraLoading } = useQuery(
    getPaymentsQuery(PAYMENT_CHAINS.ZKSYNCERA),
    {
      pollInterval,
      variables: { first, skip },
    },
  );

  const contextValue = useMemo(
    () => ({
      payments:
        mainnetData &&
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
              ...arbitrumOneData.payment_arbitrum_one.payments.map(
                (payment: any) => {
                  return { ...payment, chain: CHAINS.ARBITRUM_ONE };
                },
              ),
              ...avalancheData.payment_avalanche.payments.map(
                (payment: any) => {
                  return { ...payment, chain: CHAINS.AVALANCHE };
                },
              ),
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
              ...zksynceraData.payment_zksyncera.payments.map(
                (payment: any) => {
                  return { ...payment, chain: CHAINS.ZKSYNCERA };
                },
              ),
            ].sort((a: Payment, b: Payment) => b.timestamp - a.timestamp)
          : [],
      isLoading:
        mainnetLoading ||
        arbitrumOneLoading ||
        avalancheLoading ||
        bscLoading ||
        celoLoading ||
        fantomLoading ||
        fuseLoading ||
        maticLoading ||
        moonbeamLoading ||
        optimismLoading ||
        xdaiLoading ||
        zksynceraLoading,
    }),
    [
      mainnetData,
      arbitrumOneData,
      avalancheData,
      bscData,
      celoData,
      fantomData,
      fuseData,
      maticData,
      moonbeamData,
      optimismData,
      xdaiData,
      zksynceraData,
      mainnetLoading,
      arbitrumOneLoading,
      avalancheLoading,
      bscLoading,
      celoLoading,
      fantomLoading,
      fuseLoading,
      maticLoading,
      moonbeamLoading,
      optimismLoading,
      xdaiLoading,
      zksynceraLoading,
    ],
  );
  return (
    <LatestPaymentsContext.Provider value={contextValue}>
      {children}
    </LatestPaymentsContext.Provider>
  );
};

export const useLatestPaymentsContext = () => {
  return useContext(LatestPaymentsContext);
};

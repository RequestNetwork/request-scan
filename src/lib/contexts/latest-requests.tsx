/** @format */
'use client';

import React, { ReactNode, useContext, useMemo } from 'react';
import { Transaction } from '../types';
import { useQuery } from '@apollo/client';
import { TRANSACTIONS_QUERY } from '../queries/transactions';
import { groupBy } from '../utils';

interface ILatestRequestsContext {
  requests: {
    [channelId: string]: Transaction[];
  };
  isLoading: boolean;
}

const LatestRequestsContext = React.createContext<ILatestRequestsContext>({
  requests: {},
  isLoading: false,
});

export const LatestRequestsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const pollInterval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000;
  const first = 10;
  const skip = 0;

  const { data, loading } = useQuery(TRANSACTIONS_QUERY, {
    variables: { first, skip },
    pollInterval,
  });

  const contextValue = useMemo(
    () => ({
      requests: data?.storage.transactions
        ? groupBy(data?.storage.transactions, 'channelId')
        : [],

      isLoading: loading,
    }),
    [data?.storage.transactions, loading],
  );
  return (
    <LatestRequestsContext.Provider value={contextValue}>
      {children}
    </LatestRequestsContext.Provider>
  );
};

export const useLatestRequestsContext = () => {
  return useContext(LatestRequestsContext);
};

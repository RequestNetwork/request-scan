/** @format */
'use client';

import { useMemo } from 'react';
import { Transaction } from '../types';
import { useQuery } from '@apollo/client';
import { TRANSACTIONS_QUERY } from '../queries/transactions';
import { groupBy } from '../utils';

interface ILatestRequests {
  requests: {
    [channelId: string]: Transaction[];
  };
  isLoading: boolean;
}

export const useLatestRequests = () => {
  const pollInterval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000;
  const first = 10;
  const skip = 0;

  const { data, loading } = useQuery(TRANSACTIONS_QUERY, {
    variables: { first, skip },
    pollInterval,
  });

  const value = useMemo(
    () => ({
      requests: data?.storage.transactions
        ? groupBy(data?.storage.transactions, 'channelId')
        : [],

      isLoading: loading,
    }),
    [data?.storage.transactions, loading],
  );

  return value as ILatestRequests;
};

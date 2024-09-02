/** @format */
'use client';

import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { groupBy } from '../utils';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchRequests } from '../queries/transactions';

interface ILatestRequests {
  requests: {
    [channelId: string]: Transaction[];
  };
  isLoading: boolean;
  isFetching: boolean;
  status: string;
}

type Props = {
  first?: number;
  skip?: number;
  pollInterval?: number;
};

export const useLatestRequests = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
}: Props = {}) => {
  const queryClient = useQueryClient();

  const { status, isLoading, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['requests', first, skip],
    queryFn: () => fetchRequests({ first, skip }),
    refetchInterval: pollInterval,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  // Prefetch the next page!
  React.useEffect(() => {
    if (!isPlaceholderData) {
      const next = (skip + 1) * first;
      queryClient.prefetchQuery({
        queryKey: ['requests', first, next],
        queryFn: () => fetchRequests({ first, skip: next }),
        staleTime: 1000 * 30,
      });
    }
  }, [data, first, skip, queryClient, isPlaceholderData]);

  const value = useMemo(
    () => ({
      requests: data?.storage.transactions
        ? groupBy(
            data?.storage.transactions.map((transaction: Transaction) => {
              return {
                ...transaction,
                dataObject: JSON.parse(transaction.data),
              };
            }),
            'channelId',
          )
        : [],

      isLoading,
      status,
      isFetching,
    }),
    [
      data?.storage.transactions,
      isLoading,
      isFetching,
      isPlaceholderData,
      status,
    ],
  );

  return value as ILatestRequests;
};

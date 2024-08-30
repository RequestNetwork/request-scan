/** @format */
'use client';

import React, { useMemo } from 'react';
import { Payment } from '../types';
import { fetchPayments } from '../queries/payments';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

interface ILatestPayments {
  payments: Payment[];
  isLoading: boolean;
  status: string;
  isFetching: boolean;
}

type Props = {
  first?: number;
  skip?: number;
  pollInterval?: number;
};

export const useLatestPayments = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
}: Props = {}) => {
  const queryClient = useQueryClient();

  const { status, isLoading, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['payments', first, skip],
    queryFn: () => fetchPayments({ first, skip }),
    refetchInterval: pollInterval,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  // Prefetch the next page!
  React.useEffect(() => {
    if (!isPlaceholderData) {
      const next = (skip + 1) * first;
      queryClient.prefetchQuery({
        queryKey: ['payments', first, next],
        queryFn: () => fetchPayments({ first, skip: next }),
        staleTime: 1000 * 30,
      });
    }
  }, [data, first, skip, queryClient, isPlaceholderData]);

  const value = useMemo(
    () => ({
      payments: data,
      isLoading,
      status,
      isFetching,
    }),
    [data, isLoading, status, isPlaceholderData, isFetching],
  );

  return value as ILatestPayments;
};

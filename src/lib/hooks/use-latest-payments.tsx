/** @format */
'use client';

import { useMemo } from 'react';
import { Payment } from '../types';
import { fetchPayments } from '../queries/payments';
import { useQuery } from '@tanstack/react-query';

interface ILatestPayments {
  payments: Payment[];
  isLoading: boolean;
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
  const { isLoading, data } = useQuery({
    queryKey: ['payments', first, skip],
    queryFn: () => fetchPayments({ first, skip }),
    refetchInterval: pollInterval,
  });

  const value = useMemo(
    () => ({
      payments: data,
      isLoading,
    }),
    [data, isLoading],
  );

  return value as ILatestPayments;
};

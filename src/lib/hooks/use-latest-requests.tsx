/** @format */
'use client';

import { useMemo } from 'react';
import { Transaction } from '../types';
import { groupBy } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { fetchRequests } from '../queries/transactions';

interface ILatestRequests {
  requests: {
    [channelId: string]: Transaction[];
  };
  isLoading: boolean;
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
  const { isLoading, data } = useQuery({
    queryKey: ['requests', first, skip],
    queryFn: () => fetchRequests({ first, skip }),
    refetchInterval: pollInterval,
  });

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
    }),
    [data?.storage.transactions, isLoading],
  );

  return value as ILatestRequests;
};

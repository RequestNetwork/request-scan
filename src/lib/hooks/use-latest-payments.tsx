/** @format */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Payment } from '../types';
import { fetchPayments } from '../queries/payments';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { commonQueryOptions } from '../utils';

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
  page?: number;
};

export default async function prefetch(first: number, skip: number) {
  return fetchPayments({ first, skip });
}

export const useLatestPayments = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
  page = 0,
}: Props = {}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [prefetchedData, setPrefetchedData] = useState<Payment[] | null>();

  const { status, isLoading, data, isFetching } = useQuery({
    queryKey: ['payments', first, skip],
    queryFn: () => fetchPayments({ first, skip }),
    refetchInterval: pollInterval === 0 ? false : pollInterval,
    placeholderData: commonQueryOptions.placeholderData,
    staleTime: commonQueryOptions.staleTime,
    initialData: prefetchedData,
  });

  useEffect(() => {
    if (page === 0) {
      return;
    }
    const params = new URLSearchParams(searchParams);

    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);

    (async () => {
      const payments = await prefetch(first, page * first);
      setPrefetchedData(payments);
    })();
  }, [page]);

  const value = useMemo(
    () => ({
      payments: data,
      isLoading,
      status,
      isFetching,
    }),
    [data, isLoading, status, isFetching],
  );

  return value as ILatestPayments;
};

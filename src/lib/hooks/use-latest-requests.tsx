/** @format */
"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchRequests } from "../queries/transactions";
import type { Transaction } from "../types";
import { commonQueryOptions } from "../utils";

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
  page?: number;
};

export default async function prefetch(first: number, skip: number) {
  return fetchRequests({ first, skip });
}

export const useLatestRequests = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
  page = 0,
}: Props = {}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [prefetchedData, setPrefetchedData] = useState<{
    [channelId: string]: Transaction[];
  }>();

  const { status, isLoading, data, isFetching } = useQuery({
    queryKey: ["requests", first, skip],
    queryFn: () => fetchRequests({ first, skip }),
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

    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);

    (async () => {
      const requests = await prefetch(first, page * first);
      setPrefetchedData(requests);
    })();
  }, [page]);

  const value = useMemo(
    () => ({
      requests: data,
      isLoading,
      status,
      isFetching,
    }),
    [data, isLoading, isFetching, status],
  );

  return value as ILatestRequests;
};

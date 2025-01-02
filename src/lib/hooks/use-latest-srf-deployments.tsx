"use client";

import { useEffect, useMemo, useState } from "react";
import type { SingleRequestProxyDeployment } from "../types";
import { useQuery } from "@tanstack/react-query";
import { fetchProxyDeployments } from "../queries/srf-deployments";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { commonQueryOptions } from "../utils";

interface LatestSRFDeployments {
  deployments: SingleRequestProxyDeployment[];
  isLoading: boolean;
  status: string;
  isFetching: boolean;
  error: Error | null;
}

type Props = {
  first?: number;
  skip?: number;
  pollInterval?: number;
  page?: number;
};

export default async function prefetch(first: number, skip: number) {
  return fetchProxyDeployments({ first, skip });
}

export const useLatestSRFDeployments = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
  page = 0,
}: Props = {}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [prefetchedData, setPrefetchedData] = useState<
    SingleRequestProxyDeployment[] | null
  >();

  const { status, isLoading, data, isFetching, error } = useQuery({
    queryKey: ["srf-deployments", first, skip],
    queryFn: () => fetchProxyDeployments({ first, skip }),
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
      const deployments = await prefetch(first, page * first);
      setPrefetchedData(deployments);
    })();
  }, [page, first, pathname, replace, searchParams]);

  const value = useMemo(
    () => ({
      deployments: data,
      isLoading,
      status,
      isFetching,
      error,
    }),
    [data, isLoading, status, isFetching, error]
  );

  return value as LatestSRFDeployments;
};

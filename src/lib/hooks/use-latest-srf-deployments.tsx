"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchProxyDeployments } from "../queries/srf-deployments";
import type { SingleRequestProxyDeployment } from "../types";
import { commonQueryOptions } from "../utils";

interface ILatestSRFDeployments {
  deployments: SingleRequestProxyDeployment[];
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

export const useLatestSRFDeployments = ({
  first = 10,
  skip = 0,
  pollInterval = 0,
  page = 0,
}: Props = {}) => {
  const { status, isLoading, data, isFetching } = useQuery({
    queryKey: ["proxy-deployments", first, skip],
    queryFn: () => fetchProxyDeployments({ first, skip }),
    ...commonQueryOptions,
    refetchInterval: pollInterval === 0 ? false : pollInterval,
  });

  const value = useMemo(
    () => ({
      deployments: data,
      isLoading,
      status,
      isFetching,
    }),
    [data, isLoading, status, isFetching]
  );

  return value as ILatestSRFDeployments;
};

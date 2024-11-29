"use client";

import { SRFDeploymentsTable } from "@/components/srf-deployments-table";
import { useLatestSRFDeployments } from "@/lib/hooks/use-latest-srf-deployments";
import type { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

export default function DeploymentsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { deployments, status, isFetching } = useLatestSRFDeployments({
    first: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
    page: pagination.pageIndex + 1,
  });

  return (
    <div className="pt-24">
      <SRFDeploymentsTable
        deployments={deployments}
        isFetching={isFetching}
        status={status}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}

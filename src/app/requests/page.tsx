/** @format */
'use client';

import { RequestTable } from '@/components/request-table';
import { useLatestRequests } from '@/lib/hooks/use-latest-requests';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

export default function RequestsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { requests, status, isFetching } = useLatestRequests({
    first: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
    page: pagination.pageIndex + 1,
  });
  return (
    <div className="pt-24">
      <RequestTable
        requests={requests}
        isFetching={isFetching}
        status={status}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}

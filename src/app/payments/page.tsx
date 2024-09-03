/** @format */
'use client';

import { PaymentTable } from '@/components/payment-table';
import { useLatestPayments } from '@/lib/hooks/use-latest-payments';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

export default function PaymentsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { payments, status, isFetching } = useLatestPayments({
    first: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
    page: pagination.pageIndex + 1,
  });

  return (
    <div className="pt-24">
      <PaymentTable
        payments={payments}
        isFetching={isFetching}
        status={status}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}

/** @format */

import { LatestPaymentsProvider } from '@/lib/contexts/latest-payments';
import { PaymentTable } from './payment-table';
import { RequestTable } from './request-table';
import { LatestRequestsProvider } from '@/lib/contexts/latest-requests';

export function RecentArea() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      <LatestRequestsProvider>
        <RequestTable />
      </LatestRequestsProvider>
      <LatestPaymentsProvider>
        <PaymentTable />
      </LatestPaymentsProvider>
    </div>
  );
}

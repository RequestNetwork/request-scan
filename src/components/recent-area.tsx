/** @format */

import { RecentPaymentTable } from './recent-payment-table';
import { RecentRequestTable } from './recent-request-table';

export function RecentArea() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      <RecentRequestTable />
      <RecentPaymentTable />
    </div>
  );
}

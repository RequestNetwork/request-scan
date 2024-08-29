/** @format */

import { RecentPaymentTable } from './recent-payment-table';
import { RecentRequestTable } from './recent-request-table';

export function RecentArea() {
  return (
    <div className="grid gap-4 md:gap-8 md:grid-cols-2 grid-cols-1 place-items-center">
      <RecentRequestTable />
      <RecentPaymentTable />
    </div>
  );
}

/** @format */

import { PaymentTable } from './payment-table';
import { RequestTable } from './request-table';

export function RecentArea() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      <RequestTable />
      <PaymentTable />
    </div>
  );
}

/** @format */

import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { fetchAddressPayments } from '../queries/address-payments';
import { commonQueryOptions } from '../utils';

export function useAddressPayments(
  address: string,
  pagination: PaginationState,
) {
  return useQuery({
    queryKey: [
      'address-payments',
      address,
      pagination.pageSize,
      pagination.pageIndex * pagination.pageSize,
    ],
    queryFn: () =>
      fetchAddressPayments({
        address,
        first: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
      }),
    ...commonQueryOptions,
  });
}

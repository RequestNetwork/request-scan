/** @format */

import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { fetchAddressRequests } from '../queries/address-transactions';
import { commonQueryOptions } from '../utils';

export function useAddressRequests(
  address: string,
  pagination: PaginationState,
) {
  return useQuery({
    queryKey: [
      'address-request',
      address,
      pagination.pageSize,
      pagination.pageIndex * pagination.pageSize,
    ],
    queryFn: () =>
      fetchAddressRequests({
        address,
        first: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
      }),
    ...commonQueryOptions,
  });
}

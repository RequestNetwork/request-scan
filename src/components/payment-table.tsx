/** @format */

'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Payment } from '@/lib/types';
import TimeAgo from 'timeago-react';
import { formatTimestamp, getAmountWithCurrencySymbol } from '@/lib/utils';
import Link from 'next/link';
import { formatUnits } from 'viem';
import truncateEthAddress from 'truncate-eth-address';
import { CHAIN_SCAN_URLS } from '@/lib/consts';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from './ui/skeleton';

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'reference',
    header: 'Payment Reference',
    cell: ({ row }) => `${String(row.getValue('reference')).slice(0, 16)}...`,
  },
  {
    accessorKey: 'txHash',
    header: 'Transaction Hash',
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link
          href={`${CHAIN_SCAN_URLS[row?.original?.chain]}/tx/${row.getValue('txHash')}`}
          target="_blank"
        >
          {String(row.getValue('txHash')).slice(0, 14)}...
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'chain',
    header: 'Blockchain',
    cell: ({ row }: { row: any }) => row.getValue('chain'),
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => (
      <div className="lowercase">
        <TimeAgo
          datetime={Number(row.getValue('timestamp')) * 1000}
          locale="en_short"
        />{' '}
        ({formatTimestamp(row.getValue('timestamp'))})
      </div>
    ),
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link href={`/address/${row.getValue('from')}`}>
          {truncateEthAddress(row.getValue('from') || '')}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link href={`/address/${row.getValue('to')}`}>
          {truncateEthAddress(row.getValue('to') || '')}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      getAmountWithCurrencySymbol(
        row.getValue('amount'),
        row.original?.tokenAddress,
      ),
  },
  {
    accessorKey: 'networkFee',
    header: 'Network Fee',
    cell: ({ row }) =>
      formatUnits(
        BigInt(
          Number(row?.original?.gasUsed) * Number(row?.original?.gasPrice),
        ),
        18,
      ),
  },
  {
    accessorKey: 'feeAmount',
    header: 'Service Fee',
    cell: ({ row }) => row.getValue('feeAmount'),
  },
  {
    accessorKey: 'feeAddress',
    header: 'Service Fee Address',
    cell: ({ row }) => truncateEthAddress(row.getValue('feeAddress') || ''),
  },
];

interface PaymentTableProps {
  payments: Payment[] | undefined;
  status: string;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export function PaymentTable({
  payments,
  status,
  isFetching,
  pagination,
  setPagination,
}: PaymentTableProps) {
  const table = useReactTable({
    // Get only the first transaction for each request.
    data: payments?.slice(0, 10) || [],
    columns,
    pageCount: -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  if (status === 'pending') {
    return <Skeleton className="h-svh w-full rounded-xl" />;
  }

  if (status === 'error') {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div className="w-[95%] bg-white border rounded-lg self-center md:w-full">
      <div className="p-10">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <div className="flex items-center py-4">
          <h1 className="text-sm text-muted-foreground">All payments.</h1>
        </div>
        <div className="rounded-md md:min-h-[600px]">
          <Table className="overflow-x-scroll">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1}
          </div>
          <div className="space-x-2">
            {table.getState().pagination.pageIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.firstPage()}
                disabled={isFetching}
              >
                First
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={
                !table.getCanNextPage() ||
                isFetching ||
                table.getRowModel().rows?.length < 10
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

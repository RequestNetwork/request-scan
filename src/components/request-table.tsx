/** @format */

'use client';

import * as React from 'react';
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
import { Transaction } from '@/lib/types';
import TimeAgo from 'timeago-react';
import { formatTimestamp } from '@/lib/utils';
import { useLatestRequests } from '@/lib/hooks/use-latest-requests';
import Link from 'next/link';
import { currencyManager } from '@/lib/currency-manager';
import { formatUnits, isAddress } from 'viem';
import truncateEthAddress from 'truncate-eth-address';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'channelId',
    header: 'Request Id',
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link href={`/request/${row.getValue('channelId')}`}>
          {String(row.getValue('channelId')).slice(0, 20)}...
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'blockTimestamp',
    header: 'Timestamp',
    cell: ({ row }) => (
      <div className="lowercase">
        <TimeAgo
          datetime={Number(row.getValue('blockTimestamp')) * 1000}
          locale="en_short"
        />{' '}
        ({formatTimestamp(row.getValue('blockTimestamp'))})
      </div>
    ),
  },
  {
    accessorKey: 'payee',
    header: 'Payee',
    cell: ({ row }: { row: any }) => {
      const address = row.original?.dataObject?.data?.parameters?.payee?.value;
      return address ? truncateEthAddress(address) : 'N/A';
    },
  },
  {
    accessorKey: 'payer',
    header: 'Payer',
    cell: ({ row }: { row: any }) => {
      const address = row.original?.dataObject?.data?.parameters?.payer?.value;
      return address ? truncateEthAddress(address) : 'N/A';
    },
  },
  {
    accessorKey: 'expectedAmount',
    header: 'Expected Amount',
    cell: ({ row }: { row: any }) => {
      const currencyValue =
        row.original?.dataObject?.data?.parameters?.currency?.value;

      const currencyDetails = isAddress(currencyValue)
        ? currencyManager.fromAddress(currencyValue)
        : currencyManager.fromSymbol(currencyValue);

      return `${formatUnits(row.original?.dataObject?.data?.parameters?.expectedAmount || '0', currencyDetails?.decimals || 18) || 'N/A'} ${currencyDetails?.symbol}`;
    },
  },
];

export function RequestTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { requests, isLoading } = useLatestRequests({
    first: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  });

  const table = useReactTable({
    // Get only the first transaction for each request.
    data: Object.values(requests).map((request) => request[0]),
    columns,
    pageCount: 10,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  return (
    <div className="w-[95%] bg-white border rounded-lg self-center md:w-full">
      <div className="p-10">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
        </div>
        <div className="flex items-center py-4">
          <h1 className="text-sm text-muted-foreground">All requests.</h1>
        </div>
        <div className="rounded-md md:h-[600px]">
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
              >
                First
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

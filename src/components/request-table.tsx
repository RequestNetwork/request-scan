/** @format */

"use client";

import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/types";
import {
  calculateShortPaymentReference,
  formatTimestamp,
  getAmountWithCurrencySymbol,
  safeTruncateEthAddress,
} from "@/lib/utils";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import TimeAgo from "timeago-react";
import { Skeleton } from "./ui/skeleton";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "channelId",
    header: "Request Id",
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link href={`/request/${row.getValue("channelId")}`}>
          {String(row.getValue("channelId")).slice(0, 20)}...
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "paymentReference",
    header: "Payment Reference",
    cell: ({ row }) => {
      return calculateShortPaymentReference(
        row.original.channelId,
        row.original?.dataObject.data.parameters.extensionsData[0].parameters
          .salt || "",
        row.original?.dataObject.data.parameters.extensionsData[0].parameters
          .paymentAddress || "",
      );
    },
  },
  {
    accessorKey: "blockTimestamp",
    header: "Created",
    cell: ({ row }) => (
      <div className="lowercase">
        <TimeAgo
          datetime={Number(row.getValue("blockTimestamp")) * 1000}
          locale="en_short"
        />{" "}
        ({formatTimestamp(row.getValue("blockTimestamp"))})
      </div>
    ),
  },
  {
    accessorKey: "payee",
    header: "Payee",
    cell: ({ row }: { row: any }) => {
      const address = row.original?.dataObject?.data?.parameters?.payee?.value;

      return address ? (
        <div className="font-medium text-emerald-700">
          <Link href={`/address/${address}`}>
            {safeTruncateEthAddress(address)}
          </Link>
        </div>
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "payer",
    header: "Payer",
    cell: ({ row }: { row: any }) => {
      const address = row.original?.dataObject?.data?.parameters?.payer?.value;
      return address ? (
        <div className="font-medium text-emerald-700">
          <Link href={`/address/${address}`}>
            {safeTruncateEthAddress(address)}
          </Link>
        </div>
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "expectedAmount",
    header: "Expected Amount",
    cell: ({ row }: { row: any }) =>
      getAmountWithCurrencySymbol(
        row.original?.dataObject?.data?.parameters?.expectedAmount,
        row.original?.dataObject?.data?.parameters?.currency?.value,
      ),
  },
];

interface RequestTableProps {
  requests: { [channelId: string]: Transaction[] } | undefined;
  status: string;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export function RequestTable({
  requests,
  status,
  isFetching,
  pagination,
  setPagination,
}: RequestTableProps) {
  const table = useReactTable({
    // Get only the first transaction for each request.
    data: requests ? Object.values(requests).map((request) => request[0]) : [],
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

  if (status === "pending") {
    return <Skeleton className="h-svh w-full rounded-xl" />;
  }

  if (status === "error") {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div className="bg-white border rounded-lg w-full">
      <div className="p-10">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
        </div>
        <div className="flex items-center py-4">
          <h1 className="text-sm text-muted-foreground">All requests.</h1>
        </div>
        <div className="rounded-md">
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
                    data-state={row.getIsSelected() && "selected"}
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

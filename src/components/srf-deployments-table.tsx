"use client";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
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
import { CHAIN_SCAN_URLS } from "@/lib/consts";
import type { SingleRequestProxyDeployment } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import TimeAgo from "timeago-react";
import { Skeleton } from "./ui/skeleton";
import { formatUnits } from "viem";

export const columns: ColumnDef<SingleRequestProxyDeployment>[] = [
  {
    accessorKey: "txHash",
    header: "Transaction Hash",
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link
          href={`${CHAIN_SCAN_URLS[row.original.chain]}/tx/${row.getValue("txHash")}`}
          target="_blank"
        >
          {String(row.getValue("txHash")).slice(0, 14)}...
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "paymentReference",
    header: "Payment Reference",
    cell: ({ row }) =>
      `${String(row.getValue("paymentReference")).slice(0, 8)}...`,
  },
  {
    accessorKey: "proxyAddress",
    header: "Forwarder Address",
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link
          href={`${CHAIN_SCAN_URLS[row.original.chain]}/address/${row.getValue("proxyAddress")}`}
          target="_blank"
        >
          {row.getValue("proxyAddress")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "proxyType",
    header: "Type",
    cell: ({ row }) => row.getValue("proxyType"),
  },
  {
    accessorKey: "payee",
    header: "Payee",
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700">
        <Link href={`/address/${row.getValue("payee")}`}>
          {row.getValue("payee")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "feeAddress",
    header: "Fee Address",
    cell: ({ row }) => row.getValue("feeAddress"),
  },
  {
    accessorKey: "feeAmount",
    header: "Fee Amount",
    cell: ({ row }) => {
      const feeAmount = row.getValue("feeAmount") as string;
      return formatUnits(BigInt(feeAmount), 18);
    },
  },
  {
    accessorKey: "tokenAddress",
    header: "Token Address",
    cell: ({ row }) => {
      const tokenAddress = row.getValue("tokenAddress");
      return tokenAddress ? String(tokenAddress) : "Native Token";
    },
  },
  {
    accessorKey: "chain",
    header: "Network",
    cell: ({ row }) => row.getValue("chain"),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="lowercase">
        <TimeAgo
          datetime={Number(row.getValue("timestamp")) * 1000}
          locale="en_short"
        />{" "}
        ({formatTimestamp(row.getValue("timestamp"))})
      </div>
    ),
  },
];

interface SRFDeploymentsTableProps {
  deployments: SingleRequestProxyDeployment[] | undefined;
  status: string;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export function SRFDeploymentsTable({
  deployments,
  status,
  isFetching,
  pagination,
  setPagination,
}: SRFDeploymentsTableProps) {
  const table = useReactTable({
    data: deployments || [],
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
    <div className="w-[95%] bg-white border rounded-lg self-center md:w-full">
      <div className="p-10">
        <div>
          <h1 className="text-2xl font-bold">
            Single Request Forwarder Deployments
          </h1>
        </div>
        <div className="flex items-center py-4">
          <h1 className="text-sm text-muted-foreground">
            All Single Request Forwarder deployments.
          </h1>
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
                              header.getContext()
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
                          cell.getContext()
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

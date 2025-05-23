/** @format */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHAIN_SCAN_URLS } from "@/lib/consts";
import { useLatestPayments } from "@/lib/hooks/use-latest-payments";
import type { Payment } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import TimeAgo from "timeago-react";
import { Skeleton } from "./ui/skeleton";

export function RecentPaymentTable() {
  const { payments, isLoading } = useLatestPayments({
    pollInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-xl" />;
  }

  if (!payments) {
    return <div>No data</div>;
  }

  return (
    <Card className="xl:col-span-1 w-[95%] md:w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Payments</CardTitle>
          <CardDescription>Recent payments.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/payments">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div>No recent payments available.</div>
        ) : (
          <Table className="overflow-x-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>Payment Reference</TableHead>
                <TableHead>Transaction Hash</TableHead>
                <TableHead className="hidden 2xl:inline-block">
                  Blockchain
                </TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.slice(0, 10).map((payment: Payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.reference.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="font-medium text-emerald-700">
                      <Link
                        href={`${CHAIN_SCAN_URLS[payment.chain]}/tx/${payment.txHash}`}
                        target="_blank"
                      >
                        {payment.txHash.slice(0, 14)}...
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden 2xl:inline-block">
                    {payment.chain}
                  </TableCell>
                  <TableCell className="md:table-cell text-right">
                    <TimeAgo
                      datetime={payment.timestamp * 1000}
                      locale="en_short"
                    />{" "}
                    <span className="hidden 2xl:inline-block">
                      ({formatTimestamp(payment.timestamp)})
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

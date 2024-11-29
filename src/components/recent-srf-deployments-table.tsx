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
import { useLatestSRFDeployments } from "@/lib/hooks/use-latest-srf-deployments";
import { formatTimestamp } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import TimeAgo from "timeago-react";
import { Skeleton } from "./ui/skeleton";

export function RecentSRFDeploymentsTable() {
  const { deployments, isLoading } = useLatestSRFDeployments({
    pollInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
  });

  if (isLoading) {
    return <Skeleton className="h-svh w-full rounded-xl" />;
  }

  if (!deployments) {
    return <div>No data</div>;
  }

  return (
    <Card className="xl:col-span-1 w-[95%] md:w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Single Request Forwarder Deployments</CardTitle>
          <CardDescription>
            Recent Single Request Forwarder deployments.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/single-request-forwarders">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {deployments.length === 0 ? (
          <div>No recent Single Request Forwarder deployments available.</div>
        ) : (
          <Table className="overflow-x-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Payment Reference</TableHead>
                <TableHead>Forwarder Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden 2xl:inline-block">
                  Network
                </TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.slice(0, 10).map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell>
                    <div className="font-medium text-emerald-700">
                      <Link
                        href={`${CHAIN_SCAN_URLS[deployment.chain]}/tx/${deployment.txHash}`}
                        target="_blank"
                      >
                        {deployment.txHash.slice(0, 14)}...
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    {deployment.paymentReference?.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-emerald-700">
                      <Link
                        href={`${CHAIN_SCAN_URLS[deployment.chain]}/address/${deployment.proxyAddress}`}
                        target="_blank"
                      >
                        {deployment.proxyAddress}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{deployment.proxyType}</TableCell>
                  <TableCell className="hidden 2xl:inline-block">
                    {deployment.chain}
                  </TableCell>
                  <TableCell className="md:table-cell text-right">
                    <TimeAgo
                      datetime={deployment.timestamp * 1000}
                      locale="en_short"
                    />{" "}
                    <span className="hidden 2xl:inline-block">
                      ({formatTimestamp(deployment.timestamp)})
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

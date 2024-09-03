/** @format */
'use client';

import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { formatTimestamp } from '@/lib/utils';
import TimeAgo from 'timeago-react';
import { useLatestRequests } from '@/lib/hooks/use-latest-requests';
import { Skeleton } from './ui/skeleton';

export function RecentRequestTable() {
  const { requests, isLoading } = useLatestRequests({
    pollInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
  });

  if (isLoading) {
    return <Skeleton className="h-svh w-full rounded-xl" />;
  }

  if (!requests) {
    return <div>No data</div>;
  }

  return (
    <Card className="xl:col-span-1 w-[95%] md:w-full ">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Requests</CardTitle>
          <CardDescription>Recent requests.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/requests">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>Request Id</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(requests).map((channelId: string) => (
              <TableRow key={channelId}>
                <TableCell>
                  <div className="font-medium text-emerald-700">
                    <Link href={`/request/${channelId}`}>
                      {channelId.slice(0, 20)}...
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="md:table-cell text-right">
                  <TimeAgo
                    datetime={requests[channelId][0].blockTimestamp * 1000}
                    locale="en_short"
                  />{' '}
                  ({formatTimestamp(requests[channelId][0].blockTimestamp)})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

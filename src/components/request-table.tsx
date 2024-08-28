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
import { useLatestRequestsContext } from '@/lib/contexts/latest-requests';

export function RequestTable() {
  const { requests, isLoading } = useLatestRequestsContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!requests) {
    return <div>No data</div>;
  }

  return (
    <Card className="xl:col-span-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Requests</CardTitle>
          <CardDescription>Recent requests.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
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

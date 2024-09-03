/** @format */
'use client';

import { TransactionsAndPaymentsTable } from '@/components/transactions-and-payments-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchRequest } from '@/lib/queries/channel';
import { fetchRequestPayments } from '@/lib/queries/request-payments';
import {
  calculatePaymentReference,
  formatTimestamp,
  getAmountWithCurrencySymbol,
} from '@/lib/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Copy, Download } from 'lucide-react';
import Link from 'next/link';
import TimeAgo from 'timeago-react';

interface RequestPageProps {
  params: {
    id: string;
  };
}

export default function RequestPage({ params: { id } }: RequestPageProps) {
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequest({ id }),
    refetchInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  const reference = request
    ? calculatePaymentReference(
        id,
        request?.transactions[0].dataObject.data.parameters.extensionsData[0]
          .parameters.salt || '',
        request?.transactions[0].dataObject.data.parameters.extensionsData[0]
          .parameters.paymentAddress || '',
      )
    : '';

  const { data: requestPayments, isLoading: isLoadingRequestPayments } =
    useQuery({
      queryKey: ['request-payments', reference],
      queryFn: () => fetchRequestPayments({ reference }),
      refetchInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 30000,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    });

  if (isLoadingRequest || isLoadingRequestPayments) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />;
  }

  if (!request) {
    return <div>No data</div>;
  }

  const firstTransaction = request?.transactions[0];
  const lastTransaction =
    request?.transactions[request.transactions.length - 1];

  return (
    <div className="h-full pt-24 pb-32">
      <div className="w-[95%] bg-white border rounded-lg self-center md:w-full">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Request {id}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    navigator.clipboard.writeText(id);
                  }}
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription>
                Timestamp:{' '}
                <TimeAgo
                  datetime={firstTransaction.blockTimestamp * 1000}
                  locale="en_short"
                />{' '}
                ({formatTimestamp(firstTransaction.blockTimestamp)})
              </CardDescription>
            </div>
            {/* TODO: Export PDF 
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Export PDF
                </span>
              </Button>
            </div>
            */}
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <ul className="grid gap-3">
                <li className="flex items-center justify-start gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{lastTransaction?.dataObject?.data?.name}</span>
                </li>
                <li className="flex items-center justify-start gap-2">
                  <span className="text-muted-foreground">Payee:</span>
                  <div className="font-medium text-emerald-700">
                    <Link
                      href={`/address/${firstTransaction?.dataObject?.data?.parameters?.payee?.value}`}
                    >
                      {
                        firstTransaction?.dataObject?.data?.parameters?.payee
                          ?.value
                      }{' '}
                    </Link>
                  </div>
                </li>
                <li className="flex items-center justify-start gap-2">
                  <span className="text-muted-foreground">Payer:</span>
                  <div className="font-medium text-emerald-700">
                    <Link
                      href={`/address/${firstTransaction?.dataObject?.data?.parameters?.payer?.value}`}
                    >
                      {
                        firstTransaction?.dataObject?.data?.parameters?.payer
                          ?.value
                      }{' '}
                    </Link>
                  </div>
                </li>
                <li className="flex items-center justify-start gap-2">
                  <span className="text-muted-foreground">
                    Expected Amount:
                  </span>
                  <span>
                    {getAmountWithCurrencySymbol(
                      request?.transactions[0].dataObject.data.parameters
                        .expectedAmount,
                      request?.transactions[0].dataObject.data.parameters
                        .currency.value,
                      request?.transactions[0].dataObject.data.parameters
                        .currency.network,
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-start gap-2">
                  <span className="text-muted-foreground">Blockchain:</span>
                  <span>
                    {
                      firstTransaction?.dataObject?.data?.parameters?.currency
                        ?.network
                    }
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="grid gap-3">
                <div className="font-semibold">Actions & Payments</div>
                <div>
                  <TransactionsAndPaymentsTable
                    transactions={request.transactions || []}
                    payments={requestPayments || []}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

/** @format */
'use client';

import { TransactionsAndPaymentsTable } from '@/components/transactions-and-payments-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchRequest } from '@/lib/queries/channel';
import { fetchRequestPayments } from '@/lib/queries/request-payments';
import {
  calculateLongPaymentReference,
  calculateShortPaymentReference,
  commonQueryOptions,
  formatTimestamp,
  getAmountWithCurrencySymbol,
  getBalance,
  getContentDataFromCreateTransaction,
  getPaymentDataFromCreateTransaction,
  getTransactionCreateParameters,
  renderAddress,
} from '@/lib/utils';
import { ActorInfo } from '@requestnetwork/data-format';
import { useQuery } from '@tanstack/react-query';
import { Copy, File, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TimeAgo from 'timeago-react';
import { JsonEditor } from 'json-edit-react';
import useExportPDF from '@/lib/hooks/use-export-pdf';
import { useState } from 'react'

interface RequestPageProps {
  params: {
    id: string;
  };
}

const ActorInfoSection = ({ actorInfo }: { actorInfo?: ActorInfo }) => {
  if (
    !actorInfo ||
    Object.keys(actorInfo).every(
      (k) => !Object.keys((actorInfo as any)[k]).length,
    )
  ) {
    return 'N/A';
  }

  return (
    <div className="grid gap-3 bg-muted/50 rounded-md p-2 overflow-x-scroll">
      <ul className="grid gap-3">
        {actorInfo?.businessName && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Business Name:</span>
            <span>{actorInfo?.businessName}</span>
          </li>
        )}
        {actorInfo?.firstName && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">First Name:</span>
            <span>{actorInfo?.firstName}</span>
          </li>
        )}
        {actorInfo?.lastName && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Last Name:</span>
            <span>{actorInfo?.lastName}</span>
          </li>
        )}
        {actorInfo?.email && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Email:</span>
            <span>{actorInfo?.email}</span>
          </li>
        )}
        {actorInfo?.phone && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Phone:</span>
            <span>{actorInfo?.phone}</span>
          </li>
        )}
        {actorInfo?.address && Object.keys(actorInfo?.address).length > 0 && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Address:</span>
            <span>{renderAddress(actorInfo)}</span>
          </li>
        )}
        {actorInfo?.taxRegistration && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Tax Registration:</span>
            <span>{actorInfo?.taxRegistration}</span>
          </li>
        )}
        {actorInfo?.miscellaneous! && (
          <li className="flex items-center justify-start gap-2">
            <span className="text-muted-foreground">Miscellaneous:</span>
            <span>{JSON.stringify(actorInfo?.miscellaneous!)}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default function RequestPage({ params: { id } }: RequestPageProps) {
  const { exportPDF } = useExportPDF();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequest({ id }),
    ...commonQueryOptions,
  });

  const shortPaymentReference = request
    ? calculateShortPaymentReference(
        id,
        request?.transactions[0].dataObject.data.parameters.extensionsData[0]
          .parameters.salt || '',
        request?.transactions[0].dataObject.data.parameters.extensionsData[0]
          .parameters.paymentAddress || '',
      )
    : '';

  const longPaymentReference = shortPaymentReference
    ? calculateLongPaymentReference(shortPaymentReference)
    : '';

  const { data: requestPayments, isLoading: isLoadingRequestPayments } =
    useQuery({
      queryKey: ['request-payments', longPaymentReference],
      queryFn: () => fetchRequestPayments({ reference: longPaymentReference }),
      ...commonQueryOptions,
    });

  if (isLoadingRequest || isLoadingRequestPayments) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />;
  }

  if (!request) {
    redirect('/not-found');
  }

  const firstTransaction = request?.transactions[0];
  const lastTransaction =
    request?.transactions[request.transactions.length - 1];

  const balance = getBalance(requestPayments);
  const balanceCurrency = requestPayments?.[0]?.tokenAddress;

  const createParameters = getTransactionCreateParameters(firstTransaction);
  const contentData = getContentDataFromCreateTransaction(createParameters);
  const paymentData = getPaymentDataFromCreateTransaction(createParameters);

  const buyerData = contentData?.buyerInfo;
  const sellerData = contentData?.sellerInfo;

  const status =
    balance >= BigInt(createParameters.expectedAmount)
      ? 'Paid'
      : lastTransaction?.dataObject?.data?.name;

  const modifiedTimestamp =
    requestPayments &&
    requestPayments[requestPayments?.length - 1]?.timestamp >
      lastTransaction?.blockTimestamp
      ? requestPayments[requestPayments?.length - 1]?.timestamp
      : lastTransaction?.blockTimestamp;

  const handleExportPDF = async () => {
    setIsDownloading(true);
    await exportPDF({
      ...contentData,
      currency: createParameters.currency,
      currencyInfo: createParameters.currency,
      payer: createParameters.payer,
      payee: createParameters.payee,
      expectedAmount: createParameters.expectedAmount,
      paymentData,
    });
    setIsDownloading(false);
  };

  return (
    <div className="h-full pt-24 pb-32">
      <div className="w-[95%] bg-white border rounded-lg self-center md:w-full">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5 w-full">
              <CardTitle className="group flex items-center gap-2 text-lg break-all w-full justify-between">
                <div className="flex gap-2 items-center">
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
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleExportPDF}
                >
                  {isDownloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export PDF
                  </span>
                </Button>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm overflow-x-scroll">
            <table className="border-separate border-spacing-y-3">
              <tbody>
                <tr>
                  <td className="text-muted-foreground">Status:</td>
                  <td className="pl-16">{status}</td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Payee:</td>
                  <td className="pl-16">
                    <div className="font-medium text-emerald-700 break-all">
                      <Link href={`/address/${createParameters.payee?.value}`}>
                        {createParameters.payee?.value}
                      </Link>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Payee Details:</td>
                  <td className="pl-16">
                    <ActorInfoSection actorInfo={sellerData} />
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Payer:</td>
                  <td className="pl-16">
                    <div className="font-medium text-emerald-700 break-all">
                      <Link href={`/address/${createParameters.payer?.value}`}>
                        {createParameters.payer?.value}
                      </Link>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Payer Details:</td>
                  <td className="pl-16">
                    <ActorInfoSection actorInfo={buyerData} />
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Expected Amount:</td>
                  <td className="pl-16">
                    {getAmountWithCurrencySymbol(
                      BigInt(createParameters.expectedAmount),
                      createParameters.currency.value,
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Balance:</td>
                  <td className="pl-16">
                    {getAmountWithCurrencySymbol(
                      BigInt(balance),
                      balanceCurrency || '',
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Created:</td>
                  <td className="pl-16">
                    <TimeAgo
                      datetime={firstTransaction.blockTimestamp * 1000}
                      locale="en_short"
                    />{' '}
                    ({formatTimestamp(firstTransaction.blockTimestamp)})
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Modified:</td>
                  <td className="pl-16">
                    <TimeAgo
                      datetime={modifiedTimestamp * 1000}
                      locale="en_short"
                    />{' '}
                    ({formatTimestamp(modifiedTimestamp)})
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Payment Reference:</td>
                  <td className="pl-16">{shortPaymentReference}</td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Blockchain:</td>
                  <td className="pl-16">
                    {paymentData?.network?.charAt(0).toUpperCase() + paymentData?.network?.slice(1)}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground">Raw Content Data:</td>
                  <td className="pl-16">
                    <div className="bg-muted/50 rounded-md p-2">
                      <JsonEditor
                        data={contentData}
                        restrictEdit={true}
                        restrictDelete={true}
                        restrictAdd={true}
                        restrictDrag={true}
                        restrictTypeSelection={true}
                        theme="githubLight"
                        collapse={true}
                        rootFontSize={14}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="grid gap-3">
                <div className="font-semibold">Actions & Payments</div>
                <div className="overflow-x-scroll">
                  <TransactionsAndPaymentsTable
                    transactions={request?.transactions || []}
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

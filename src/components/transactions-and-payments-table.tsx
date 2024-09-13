/** @format */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CHAIN_SCAN_URLS } from '@/lib/consts';
import { Payment, Transaction } from '@/lib/types';
import {
  formatTimestamp,
  getAmountWithCurrencySymbol,
  safeTruncateEthAddress,
} from '@/lib/utils';
import Link from 'next/link';
import TimeAgo from 'timeago-react';
import { formatUnits } from 'viem';

interface Props {
  transactions: Transaction[];
  payments: Payment[];
}

export function TransactionsAndPaymentsTable({
  transactions,
  payments,
}: Props) {
  const allData: ((Transaction & { timestamp: number }) | Payment)[] = [
    ...transactions.map((transaction) => {
      return { ...transaction, timestamp: transaction.blockTimestamp };
    }),
    ...payments,
  ];

  allData.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Id</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Network Fee</TableHead>
          <TableHead className="text-right">Service Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {'dataObject' in item ? 'action' : 'payment'}
            </TableCell>
            <TableCell className="font-medium">
              {'dataObject' in item ? item?.dataObject?.data?.name : ''}
            </TableCell>
            <TableCell>
              {'chain' in item ? (
                <div className="font-medium text-emerald-700">
                  <Link
                    href={`${CHAIN_SCAN_URLS[item.chain]}/tx/${item.txHash}`}
                    target="_blank"
                  >
                    {`${item.txHash.slice(0, 14)}...`}
                  </Link>
                </div>
              ) : (
                `${item.id.slice(0, 14)}...`
              )}
            </TableCell>
            <TableCell>
              <TimeAgo datetime={item.timestamp * 1000} locale="en_short" /> (
              {formatTimestamp(item.timestamp)})
            </TableCell>
            <TableCell className="font-medium">
              {'from' in item ? (
                <div className="font-medium text-emerald-700">
                  <Link href={`/address/${item.from}`}>
                    {safeTruncateEthAddress(item.from)}{' '}
                  </Link>
                </div>
              ) : (
                ''
              )}
            </TableCell>
            <TableCell className="font-medium">
              {'to' in item ? (
                <div className="font-medium text-emerald-700">
                  <Link href={`/address/${item.to}`}>
                    {safeTruncateEthAddress(item.to)}{' '}
                  </Link>
                </div>
              ) : (
                ''
              )}
            </TableCell>
            <TableCell className="font-medium">
              {'dataObject' in item
                ? getAmountWithCurrencySymbol(
                    item?.dataObject?.data?.parameters?.expectedAmount || 0,
                    item?.dataObject?.data?.parameters?.currency?.value,
                  )
                : getAmountWithCurrencySymbol(
                    BigInt(item?.amount),
                    item?.tokenAddress,
                  )}
            </TableCell>
            <TableCell className="font-medium">
              {'gasUsed' in item
                ? formatUnits(
                    BigInt(Number(item?.gasUsed) * Number(item?.gasPrice)),
                    18,
                  )
                : ''}
            </TableCell>
            <TableCell className="font-medium text-right">
              {'feeAmount' in item ? item.feeAmount : ''}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

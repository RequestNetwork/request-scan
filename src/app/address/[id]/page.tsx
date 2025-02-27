/** @format */
"use client";
import { PaymentTable } from "@/components/payment-table";
import { RequestTable } from "@/components/request-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddressPayments } from "@/lib/hooks/use-address-payments";
import { useAddressRequests } from "@/lib/hooks/use-address-requests";
import type { PaginationState } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { useState } from "react";

interface AddressPageProps {
  params: {
    id: string;
  };
}

export default function AddressPage({ params: { id } }: AddressPageProps) {
  const [requestPagination, setRequestPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [paymentsPagination, setPaymentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    status: requestStatus,
    data: requests,
    isFetching: requestIsFetching,
  } = useAddressRequests(id, requestPagination);

  const {
    status: paymentStatus,
    data: payments,
    isFetching: paymentIsFetching,
  } = useAddressPayments(id, paymentsPagination);

  return (
    <div className="flex-col items-start justify-start space-y-10 pt-24">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="group flex items-center gap-2 text-lg break-all">
              Address {id}
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
              Recent requests and payments for this address.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div>
        <Tabs defaultValue="requests">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="requests">
            <RequestTable
              status={requestStatus}
              requests={requests}
              isFetching={requestIsFetching}
              pagination={requestPagination}
              setPagination={setRequestPagination}
            />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTable
              status={paymentStatus}
              payments={payments}
              isFetching={paymentIsFetching}
              pagination={paymentsPagination}
              setPagination={setPaymentPagination}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

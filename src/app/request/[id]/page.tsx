/** @format */

import { fetchRequest } from "@/lib/queries/channel";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RequestDetails } from "./request-details";

interface RequestPageProps {
  params: {
    id: string;
  };
}

// Memoized per render pass so generateMetadata and the page share one network
// call. The fetch-level cache cannot do this: graphql-request issues a POST,
// which Next's Data Cache does not dedupe, and the cache() wrapper inside
// graphQlClient is keyed on a fresh RequestInit object per call. Keying on the
// id string here is what actually collapses the two reads into one.
const getRequest = cache((id: string) => fetchRequest({ id }));

// A missing request is marked noindex rather than returning a 404 status, and
// that is a deliberate concession to a framework limit, not an oversight. This
// route streams (Transfer-Encoding: chunked), so the HTTP status is committed
// when the shell flushes, before the lookup resolves. notFound() therefore
// swaps the rendered UI but cannot change the status — verified both from the
// page body and from generateMetadata; both return 200. Until that can return a
// real 404 (which needs the check to run before the response commits, i.e. in
// middleware), noindex is what actually prevents these from polluting the
// search index, which is the harm a soft 404 does.
export const generateMetadata = async ({
  params: { id },
}: RequestPageProps): Promise<Metadata> => {
  const request = await getRequest(id);

  if (!request) {
    return {
      title: "Request not found | Request Scan",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Request ${id} | Request Scan`,
    description: `Details of request ${id} on the Request Network: status, payee, payer, expected amount, balance, payment reference, transactions and payments.`,
  };
};

export default async function RequestPage({
  params: { id },
}: RequestPageProps) {
  // Fetched on the server so crawlers and link previews receive the request in
  // the initial HTML. A thrown fetch is intentionally left to propagate to the
  // error boundary: a backend outage must not be reported as "this request does
  // not exist".
  const request = await getRequest(id);

  if (!request) {
    notFound();
  }

  return <RequestDetails id={id} request={request} />;
}

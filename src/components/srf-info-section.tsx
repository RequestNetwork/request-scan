import { SingleRequestProxyDeployment } from "@/lib/types";
import Link from "next/link";
import { CHAIN_SCAN_URLS } from "@/lib/consts";
import { formatUnits } from "viem";
import { formatTimestamp } from "@/lib/utils";
import TimeAgo from "timeago-react";

interface SRFInfoSectionProps {
  deployments: SingleRequestProxyDeployment[];
}

export function SRFInfoSection({ deployments }: SRFInfoSectionProps) {
  if (!deployments?.length) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="font-semibold">Single Request Forwarders</div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="p-2">Network</th>
              <th className="p-2">Forwarder Address</th>
              <th className="p-2">Type</th>
              <th className="p-2">Payee</th>
              <th className="p-2">Token Address</th>
              <th className="p-2">Fee Amount</th>
              <th className="p-2">Fee Address</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr key={deployment.id} className="border-t">
                <td className="p-2">{deployment.chain}</td>
                <td className="p-2">
                  <Link
                    href={`${CHAIN_SCAN_URLS[deployment.chain]}/address/${deployment.proxyAddress}`}
                    className="text-emerald-700 hover:underline"
                    target="_blank"
                  >
                    {deployment.proxyAddress}
                  </Link>
                </td>
                <td className="p-2">{deployment.proxyType}</td>
                <td className="p-2">
                  <Link
                    href={`/address/${deployment.payee}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {deployment.payee}
                  </Link>
                </td>
                <td className="p-2">
                  {deployment.tokenAddress ? (
                    <Link
                      href={`${CHAIN_SCAN_URLS[deployment.chain]}/token/${deployment.tokenAddress}`}
                      className="text-emerald-700 hover:underline"
                      target="_blank"
                    >
                      {deployment.tokenAddress}
                    </Link>
                  ) : (
                    "Native Token"
                  )}
                </td>
                <td className="p-2">
                  {formatUnits(BigInt(deployment.feeAmount), 18)}
                </td>
                <td className="p-2">
                  <Link
                    href={`/address/${deployment.feeAddress}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {deployment.feeAddress}
                  </Link>
                </td>
                <td className="p-2">
                  <TimeAgo
                    datetime={deployment.timestamp * 1000}
                    locale="en_short"
                  />{" "}
                  <span className="hidden 2xl:inline-block">
                    ({formatTimestamp(deployment.timestamp)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

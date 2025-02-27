/** @format */
"use client";

import type { Invoice, InvoiceItem } from "@requestnetwork/data-format";
// @ts-expect-error: No html2pdf does not have the @types to install
import html2pdf from "html2pdf.js";
import { formatUnits, isAddress } from "viem";
import { currencyManager } from "../currency-manager";
import type { PaymentData } from "../types";
import { capitalize, renderAddress } from "../utils";

const RENDER_DELAY_MS = 3000; // Define this at the top of the file or in a config

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useExportPDF() {
  // Add timeout handling
  const TIMEOUT_MS = 10000;
  const MAX_RETRIES = 3;

  const formatDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "-";
  };

  const getCurrencyDetails = (currency: any) => {
    const currencyDetails: { symbol: string; decimals: number } | undefined =
      isAddress(currency)
        ? currencyManager.fromAddress(currency)
        : currencyManager.fromSymbol(currency);

    return currencyDetails;
  };

  const calculateItemTotal = (item: InvoiceItem): bigint => {
    try {
      const unitPrice = BigInt(Math.floor(Number(item.unitPrice || 0)));
      const discount = BigInt(Math.floor(Number(item.discount || 0)));
      const taxPercentage = Number(item.tax?.amount || 0);
      const quantity = BigInt(Math.floor(Number(item.quantity || 1)));

      const priceAfterDiscount = unitPrice - discount;
      const taxAmount =
        (priceAfterDiscount * BigInt(Math.floor(taxPercentage * 100))) /
        BigInt(10000);
      const itemTotal = (priceAfterDiscount + taxAmount) * quantity;

      return itemTotal;
    } catch (error) {
      console.error("Error calculating item total:", error);
      return BigInt(0);
    }
  };

  const formatBigIntAmount = (
    amount: string | number | undefined,
    decimals: number,
  ): string => {
    try {
      if (!amount) return "0";
      const value = Math.floor(Number(amount));
      return formatUnits(BigInt(value), decimals || 0);
    } catch (error) {
      console.error("Error formatting amount:", error);
      return "0";
    }
  };

  const exportPDF = async (
    invoice: Invoice & {
      currency: any;
      currencyInfo: any;
      payer: any;
      payee: any;
      expectedAmount: any;
      paymentData: PaymentData;
    },
  ) => {
    let retries = 0;

    const generatePDF = async () => {
      try {
        const currencyDetails = getCurrencyDetails(invoice.currencyInfo?.value);
        const paymentCurrencyDetails = getCurrencyDetails(
          invoice.paymentData?.acceptedTokens?.length > 0
            ? invoice.paymentData.acceptedTokens[0]
            : undefined,
        );

        // Sanitize invoice number for filename
        const safeInvoiceNumber = (invoice?.invoiceNumber || "unknown")
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase();

        const content = `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
        #pdf-container {
          font-family: 'Urbanist', sans-serif;
          font-size: 10px;
        }
        #pdf-container table {
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
        }
        #pdf-container td, #pdf-container th {
          word-wrap: break-word;
          border: 1px solid #ddd;
          padding: 4px;
        }
        #pdf-container th {
          background-color: #f2f2f2;
          text-align: left;
        }
      </style>
    </head>
    <body>
    <div id="pdf-container" style="max-width: 680px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <img src="${window.location.origin}/logo-1.png" 
             alt="Logo" 
             style="width: 50px; height: 50px; object-fit: contain; margin-bottom: 20px;">
        <div style="text-align: right;">
          <p>Issued on ${formatDate(invoice?.creationDate)}</p>
          <p>Payment due by ${formatDate(invoice?.paymentTerms?.dueDate)}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 24px; font-weight: bold; margin-bottom: 14px;">INVOICE #${
        invoice?.invoiceNumber || "-"
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 10px;">
        <div style="width: 48%;">
          <strong>From:</strong><br>
          <p style="font-size: 10px; margin: 3px 0; word-break: break-all;">${
            invoice.payee?.value || "-"
          }</p>
          <p style="font-size: 10px; margin: 3px 0;">${
            invoice?.sellerInfo?.firstName || ""
          } ${invoice?.sellerInfo?.lastName || ""}</p>
          <p style="font-size: 10px; margin: 3px 0;">${renderAddress(
            invoice?.sellerInfo,
          )}</p>
          ${
            invoice?.sellerInfo?.taxRegistration
              ? `<p style="font-size: 10px; margin: 3px 0;">VAT: ${invoice.sellerInfo.taxRegistration}</p>`
              : ""
          }
        </div>

        <div style="width: 48%;">
          <strong>To:</strong><br>
          <p style="font-size: 10px; margin: 3px 0; word-break: break-all;">${
            invoice.payer?.value || "-"
          }</p>
          <p style="font-size: 10px; margin: 3px 0;">${
            invoice?.buyerInfo?.firstName || ""
          } ${invoice?.buyerInfo?.lastName || ""}</p>
          <p style="font-size: 10px; margin: 3px 0;">${renderAddress(
            invoice?.buyerInfo,
          )}</p>
          ${
            invoice?.buyerInfo?.taxRegistration
              ? `<p style="font-size: 10px; margin: 3px 0;">VAT: ${invoice.buyerInfo.taxRegistration}</p>`
              : ""
          }
        </div>
      </div>

      <div style="margin-bottom: 20px; font-size: 10px;">
        <strong>Payment Chain:</strong> ${
          invoice?.paymentData?.network
            ? capitalize(invoice?.paymentData?.network)
            : "-"
        }<br>
        <strong>Invoice Currency:</strong> ${currencyDetails?.symbol || "-"}<br>
        <strong>Settlement Currency:</strong> ${
          paymentCurrencyDetails?.symbol || "-"
        }<br>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Description</th>
            <th style="width: 10%; text-align: right;">Quantity</th>
            <th style="width: 20%; text-align: right;">Unit Price</th>
            <th style="width: 15%; text-align: right;">Discount</th>
            <th style="width: 10%; text-align: right;">Tax</th>
            <th style="width: 20%; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(invoice?.invoiceItems || [])
            .map(
              (item: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.name || "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.quantity || "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBigIntAmount(
                item.unitPrice,
                currencyDetails?.decimals || 0,
              )}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBigIntAmount(
                item.discount,
                currencyDetails?.decimals || 0,
              )}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.tax?.amount ? `${item.tax.amount}%` : "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBigIntAmount(
                calculateItemTotal(item).toString(),
                currencyDetails?.decimals || 0,
              )}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Due:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${
              invoice.expectedAmount
                ? `${formatUnits(
                    BigInt(invoice.expectedAmount),
                    currencyDetails?.decimals || 0,
                  )} ${currencyDetails?.symbol || ""}`
                : "-"
            }</strong></td>
          </tr>
        </tfoot>
      </table>
      
      ${
        invoice?.note
          ? `<div style="margin-top: 20px; font-size: 10px;">
        <h3>Note:</h3>
        <p>${invoice.note}</p>
      </div>`
          : ""
      }
    </div>
    </body>
    </html>
  `;

        const opt = {
          margin: 10,
          filename: `invoice-${safeInvoiceNumber}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false, // Disable logging
            timeout: TIMEOUT_MS,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
        };

        // Create container outside the viewport
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "-9999px";
        document.body.appendChild(container);

        try {
          const element = document.createElement("div");
          element.innerHTML = content;
          container.appendChild(element);

          await sleep(RENDER_DELAY_MS);
          await Promise.race([
            html2pdf().from(element).set(opt).save(),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("PDF generation timeout")),
                TIMEOUT_MS,
              ),
            ),
          ]);
        } finally {
          // Ensure cleanup happens even if there's an error
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }
      } catch (error) {
        if (retries < MAX_RETRIES) {
          retries++;
          console.warn(
            `PDF generation failed, attempt ${retries} of ${MAX_RETRIES}`,
          );
          await sleep(1000); // Wait before retrying
          return generatePDF();
        }
        throw error;
      }
    };

    await generatePDF();
  };

  return {
    exportPDF,
  };
}

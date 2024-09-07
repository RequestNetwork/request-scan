/** @format */

import { Invoice } from '@requestnetwork/data-format';
import { calculateItemTotal } from '@requestnetwork/shared';
import { formatUnits, isAddress } from 'viem';
import Html from 'react-pdf-html';
import { Document, Page, pdf } from '@react-pdf/renderer';
import { currencyManager } from '../currency-manager';
import { saveAs } from 'file-saver';
import { renderAddress } from '../utils';

export function useExportPDF() {
  const formatDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString() : '-';
  };

  const getCurrencyDetails = (currency: any) => {
    const currencyDetails: { symbol: string; decimals: number } | undefined =
      isAddress(currency)
        ? currencyManager.fromAddress(currency)
        : currencyManager.fromSymbol(currency);

    return currencyDetails;
  };

  const exportPDF = async (
    invoice: Invoice & {
      currency: any;
      currencyInfo: any;
      payer: any;
      payee: any;
      expectedAmount: any;
    },
  ) => {
    const currencyDetails = getCurrencyDetails(invoice.currencyInfo?.value);

    const content = `
    <html>
    <head>
    </head>
    <body>
    <div id="invoice" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="text-align: right;">
          <p>Issued on ${formatDate(invoice?.creationDate)}</p>
          <p>Payment due by ${formatDate(invoice?.paymentTerms?.dueDate)}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 28px; font-weight: bold; margin-bottom: 14px;">INVOICE #${
        invoice?.invoiceNumber || '-'
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 10px;">
        <div>
          <strong>From:</strong><br>
          <p style="font-size: 14px">${invoice.payee?.value || '-'}</p>
          ${invoice?.sellerInfo?.firstName || ''} ${invoice?.sellerInfo?.lastName || ''}<br>
          ${renderAddress(invoice?.sellerInfo)}<br>
          ${invoice?.sellerInfo?.taxRegistration ? `VAT: ${invoice.sellerInfo.taxRegistration}` : ''}
        </div>

        <div>
          <strong>To:</strong><br>
          <p style="font-size: 14px">${invoice.payer?.value || '-'}</p>
          ${invoice?.buyerInfo?.firstName || ''} ${invoice?.buyerInfo?.lastName || ''}<br>
          ${renderAddress(invoice?.buyerInfo)}<br>
          ${invoice?.buyerInfo?.taxRegistration ? `VAT: ${invoice.buyerInfo.taxRegistration}` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong>Payment Chain:</strong> ${invoice.currencyInfo?.network || '-'}<br>
        <strong>Invoice Currency:</strong> ${currencyDetails?.symbol || '-'}<br>
        <strong>Invoice Type:</strong> Regular Invoice
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Discount</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tax</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(invoice?.invoiceItems || [])
            .map(
              (item: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.unitPrice
                  ? formatUnits(
                      BigInt(item.unitPrice),
                      currencyDetails?.decimals || 0,
                    )
                  : '-'
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.discount
                  ? formatUnits(
                      BigInt(item.discount),
                      currencyDetails?.decimals || 0,
                    )
                  : '-'
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.tax?.amount ? `${item.tax.amount}%` : '-'
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item
                  ? formatUnits(
                      BigInt(calculateItemTotal(item)),
                      currencyDetails?.decimals || 0,
                    )
                  : '-'
              }</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Due:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${
              invoice.expectedAmount
                ? `${formatUnits(BigInt(invoice.expectedAmount), currencyDetails?.decimals || 0)} ${invoice.currency || ''}`
                : '-'
            }</strong></td>
          </tr>
        </tfoot>
      </table>
      
      ${
        invoice?.note
          ? `<div style="margin-top: 20px;">
        <h3>Note:</h3>
        <p>${invoice.note}</p>
      </div>`
          : ''
      }
    </div>
    </body>
    </html>
  `;

    const MyDocument = () => (
      <Document>
        <Page>
          <Html>{content}</Html>
        </Page>
      </Document>
    );

    const doc = <MyDocument />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, `invoice-${invoice.invoiceNumber}.pdf`);
  };

  return {
    exportPDF,
  };
}

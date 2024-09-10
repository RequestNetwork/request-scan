/** @format */
'use client';

import { Invoice, InvoiceItem } from '@requestnetwork/data-format';
import { formatUnits, isAddress } from 'viem';
import { currencyManager } from '../currency-manager';
import { renderAddress } from '../utils';

declare global {
  interface Window {
    html2pdf: any;
  }
}

export default function useExportPDF() {
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const ensureHtml2PdfLoaded = async () => {
    if (typeof window.html2pdf === 'undefined') {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      );
    }
  };

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

  const calculateItemTotal = (item: InvoiceItem): number => {
    const { discount = 0, unitPrice = 0, tax = { amount: 0 } } = item;
    const discountAmount = Number(discount);
    const priceAfterDiscount = Number(unitPrice) - discountAmount;
    const taxAmount = priceAfterDiscount * (Number(tax.amount) / 100);
    const itemTotal = (priceAfterDiscount + taxAmount) * item.quantity;
    return itemTotal;
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
    await ensureHtml2PdfLoaded();

    const currencyDetails = getCurrencyDetails(invoice.currencyInfo?.value);

    const content = `
    <html>
    <head>
    </head>
    <body>
    <div id="invoice" style="max-width: 800px; margin: 0 auto; padding: 5px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="text-align: right;">
          <p>Issued on ${formatDate(invoice?.creationDate)}</p>
          <p>Payment due by ${formatDate(invoice?.paymentTerms?.dueDate)}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 28px; font-weight: bold; margin-bottom: 14px;">INVOICE #${
        invoice?.invoiceNumber || '-'
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 5px; gap:2%;">
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
                ? `${formatUnits(BigInt(invoice.expectedAmount), currencyDetails?.decimals || 0)} ${currencyDetails?.symbol || ''}`
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

    const opt = {
      margin: 10,
      filename: `invoice-${invoice.invoiceNumber || 'unknown'}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
    };

    const element = document.createElement('div');
    element.innerHTML = content;
    document.body.appendChild(element);

    await window.html2pdf().from(element).set(opt).save();

    document.body.removeChild(element);
  };

  return {
    exportPDF,
  };
}

/**
 * Dynamically load html2pdf.js and export the invoice preview as A4 PDF
 */
export async function exportToPdf(elementId, filename = 'invoice.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Invoice preview element not found');
        return;
    }

    // Dynamic import to handle UMD/CJS module properly
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
        },
    };

    return html2pdf().set(opt).from(element).save();
}

/**
 * Print the invoice
 */
export function printInvoice(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
            } catch {
                return '';
            }
        })
        .join('\n');

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
      <style>
        ${styles}
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
}

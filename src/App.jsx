import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { exportToPdf, printInvoice } from './utils/exportPdf';
import { generateInvoiceNumber } from './utils/calculations';
import './App.css';

const defaultData = {
  company: {
    name: 'CASCON',
    address: 'Kasim Lane, Kaloor,\nKochi, Kerala\nIndia',
    website: 'www.wecascon.com',
    phone: '8943818733',
    email: 'hello@wecascon.com',
  },
  client: {
    name: 'Client Name',
    address: '',
    shippedTo: '',
  },
  meta: {
    invoiceNumber: generateInvoiceNumber(1),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  },
  lineItems: [
    { description: 'Shopify Store Development', qty: 1, rate: 0, discount: 0, gstPercent: 18 },
    { description: 'Meta Ads Management', qty: 1, rate: 0, discount: 0, gstPercent: 18 },
    { description: 'AI Video Production', qty: 1, rate: 0, discount: 0, gstPercent: 18 },
    { description: 'AI Product Photography', qty: 1, rate: 0, discount: 0, gstPercent: 18 },
  ],
  payment: {
    method: 'Bank Transfer',
    accountNumber: '55550128728894',
    accountName: 'Ijas Ahammed',
    ifsc: 'FDRL0005555',
    bank: 'Federal Bank,\nKaloor Branch, Kochi, KL',
    upiId: 'ijasa95@fifederal',
  },
  signature: {
    acceptedBy: 'Client Name',
    signedBy: 'Cascon',
  },
};

function App() {
  const [view, setView] = useState('landing');
  const [data, setData] = useState(defaultData);
  const [exporting, setExporting] = useState(false);

  async function handleExportPdf() {
    setExporting(true);
    try {
      const filename = `${data.meta.invoiceNumber || 'invoice'}.pdf`;
      await exportToPdf('invoice-preview', filename);
    } finally {
      setExporting(false);
    }
  }

  function handlePrint() {
    printInvoice('invoice-preview');
  }

  if (view === 'landing') {
    return (
      <div className="landing">
        <div className="landing-bg">
          <div className="landing-glow glow-1" />
          <div className="landing-glow glow-2" />
          <div className="landing-glow glow-3" />
        </div>
        <div className="landing-content">
          <div className="landing-badge">⚡ Instant Invoice Generator</div>
          <h1 className="landing-title">
            Generate <span className="text-accent">Professional</span><br />
            Invoices in Seconds
          </h1>
          <p className="landing-desc">
            No sign-up required. Fill in your details, preview your invoice,
            and download a pixel-perfect PDF — all in under 30 seconds.
          </p>
          <button className="btn-primary" onClick={() => setView('generator')}>
            <span className="btn-icon">📄</span>
            Create New Invoice
          </button>
          <div className="landing-features">
            <div className="feature-chip">✅ GST Calculations</div>
            <div className="feature-chip">✅ QR Code UPI</div>
            <div className="feature-chip">✅ A4 PDF Export</div>
            <div className="feature-chip">✅ Amount in Words</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="generator">
      {/* Top Bar */}
      <div className="gen-topbar">
        <button className="btn-back" onClick={() => setView('landing')}>
          ← Back
        </button>
        <h1 className="gen-topbar-title">Invoice Generator</h1>
        <div className="gen-topbar-actions">
          <button className="btn-secondary" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="btn-primary btn-sm" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? '⏳ Generating...' : '📥 Download PDF'}
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="gen-layout">
        <div className="gen-form-panel">
          <InvoiceForm data={data} setData={setData} />
        </div>
        <div className="gen-preview-panel">
          <InvoicePreview data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { exportToPdf, printInvoice } from './utils/exportPdf';
import { generateInvoiceNumber } from './utils/calculations';
import './App.css';

const defaultData = {
  company: {
    name: 'INNOVUS',
    address: '67, Navniman Society, Pratap Nagar,\nNagpur, Maharashtra - 440022\nIndia',
    website: 'www.innovustech.in',
    phone: '7709501644',
    email: 'hello@innovustech.in',
  },
  client: {
    name: 'Nike Inc.',
    address: 'Nike One Way, Hollywood Blv.,\nLos Angeles, 110022 CA,\nUSA',
    shippedTo: 'Nike Inc. Hollywood Blv.,\nLos Angeles,\n110022 CA,\nUSA',
  },
  meta: {
    invoiceNumber: generateInvoiceNumber(1),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  },
  lineItems: [
    { description: 'Website Design', qty: 1, rate: 50000, discount: 0, gstPercent: 9 },
    { description: 'Website Development', qty: 1, rate: 20000, discount: 0, gstPercent: 9 },
    { description: 'UX Design', qty: 1, rate: 20000, discount: 0, gstPercent: 9 },
    { description: 'Website Copywriting', qty: 1, rate: 10000, discount: 0, gstPercent: 9 },
  ],
  payment: {
    method: 'Cash',
    accountNumber: '510101006820471',
    accountName: 'Innovus Tech',
    ifsc: 'UBIN0933465',
    bank: 'Union Bank Of India,\nPratapnagar branch, Nagpur, MH',
    upiId: 'innovustech@uboi',
  },
  signature: {
    acceptedBy: 'Nike Inc.',
    signedBy: 'Innovus Tech',
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

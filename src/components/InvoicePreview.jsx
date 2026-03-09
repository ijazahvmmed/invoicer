import { QRCodeSVG } from 'qrcode.react';
import { calcLineItem, calcSubtotal, calcTotalGST, calcGrandTotal, formatIndianNumber, numberToIndianWords } from '../utils/calculations';
import './InvoicePreview.css';

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

export default function InvoicePreview({ data }) {
    const subtotal = calcSubtotal(data.lineItems);
    const totalGST = calcTotalGST(data.lineItems);
    const grandTotal = calcGrandTotal(data.lineItems);
    const amountInWords = numberToIndianWords(grandTotal);
    const upiLink = data.payment.upiId ? `upi://pay?pa=${data.payment.upiId}&pn=${encodeURIComponent(data.company.name)}&am=${grandTotal}&cu=INR` : '';

    return (
        <div className="invoice-preview" id="invoice-preview">
            <div className="invoice-page">

                {/* Header */}
                <div className="inv-header">
                    <h1 className="inv-company-title">{data.company.name || 'COMPANY'}</h1>
                    <span className="inv-badge">INVOICE</span>
                </div>

                {/* Company + Contact */}
                <div className="inv-company-row">
                    <div className="inv-company-info">
                        <strong>{data.company.name}</strong>
                        <span className="inv-address">{data.company.address}</span>
                    </div>
                    <div className="inv-contact-info">
                        <strong>Contact</strong>
                        <span>{data.company.website}</span>
                        <span>{data.company.phone}</span>
                        <span>{data.company.email}</span>
                    </div>
                </div>

                {/* Invoice Meta Bar */}
                <div className="inv-meta-bar">
                    <div className="inv-meta-item">
                        <span className="inv-meta-label">Due Amount</span>
                        <span className="inv-meta-value">₹ {formatIndianNumber(grandTotal)}</span>
                    </div>
                    <div className="inv-meta-item">
                        <span className="inv-meta-label">Due Date</span>
                        <span className="inv-meta-value">{formatDate(data.meta.dueDate)}</span>
                    </div>
                    <div className="inv-meta-item">
                        <span className="inv-meta-label">Invoice #</span>
                        <span className="inv-meta-value">{data.meta.invoiceNumber}</span>
                    </div>
                    <div className="inv-meta-item">
                        <span className="inv-meta-label">Invoice Date</span>
                        <span className="inv-meta-value">{formatDate(data.meta.invoiceDate)}</span>
                    </div>
                </div>

                {/* Client Details */}
                <div className="inv-client-row">
                    <div className="inv-client-block">
                        <strong>Invoice To</strong>
                        <span className="inv-client-name">{data.client.name}</span>
                        <span className="inv-client-address">{data.client.address}</span>
                    </div>
                    <div className="inv-client-block">
                        <strong>Shipped To</strong>
                        <span className="inv-client-address">{data.client.shippedTo}</span>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="inv-table">
                    <thead>
                        <tr>
                            <th className="col-num">#</th>
                            <th className="col-desc">Desc. of Goods/Services</th>
                            <th className="col-qty">Qty.</th>
                            <th className="col-rate">Rate (₹)</th>
                            <th className="col-dis">Dis.</th>
                            <th className="col-gst">GST</th>
                            <th className="col-total">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lineItems.map((item, i) => {
                            const { base, total } = calcLineItem(item.qty, item.rate, item.discount, item.gstPercent);
                            return (
                                <tr key={i}>
                                    <td className="col-num">{i + 1}</td>
                                    <td className="col-desc">{item.description}</td>
                                    <td className="col-qty">{item.qty} U</td>
                                    <td className="col-rate">{formatIndianNumber(item.rate)}</td>
                                    <td className="col-dis">{item.discount}</td>
                                    <td className="col-gst">{item.gstPercent}</td>
                                    <td className="col-total">{formatIndianNumber(base)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Summary Row */}
                <div className="inv-summary-row">
                    <div className="inv-summary-left">
                        <div className="inv-payment-method">
                            <strong>Payment Method</strong>
                            <span>{data.payment.method}</span>
                        </div>
                        <div className="inv-in-words">
                            <strong>In Words</strong>
                            <span>{amountInWords}</span>
                        </div>
                    </div>
                    <div className="inv-summary-right">
                        <div className="inv-total-line">
                            <span>Sub Total</span>
                            <span>{formatIndianNumber(subtotal)}</span>
                        </div>
                        <div className="inv-total-line">
                            <span>GST</span>
                            <span>{formatIndianNumber(totalGST)}</span>
                        </div>
                        <div className="inv-total-line inv-grand-total">
                            <span>Total</span>
                            <span>{formatIndianNumber(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Signature Row */}
                <div className="inv-signature-row">
                    <div className="inv-sig-block">
                        <strong>Accepted By</strong>
                        <span>{data.signature.acceptedBy}</span>
                    </div>
                    <div className="inv-sig-block inv-sig-right">
                        <strong>Signature</strong>
                        <span>{data.signature.signedBy}</span>
                    </div>
                </div>

                {/* Payment Footer */}
                <div className="inv-footer">
                    <div className="inv-bank-info">
                        <strong>Payment Info</strong>
                        <div className="inv-bank-details">
                            <div><span className="inv-bank-label">Ac #</span> {data.payment.accountNumber}</div>
                            <div><span className="inv-bank-label">Ac Name</span> {data.payment.accountName}</div>
                            <div><span className="inv-bank-label">IFSCode</span> {data.payment.ifsc}</div>
                            <div><span className="inv-bank-label">Bank</span> {data.payment.bank}</div>
                        </div>
                    </div>
                    <div className="inv-qr-block">
                        {upiLink && (
                            <>
                                <QRCodeSVG value={upiLink} size={110} level="M" />
                                <div className="inv-qr-info">
                                    <strong>Name: {data.company.name}</strong>
                                    <span>UPI: {data.payment.upiId}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

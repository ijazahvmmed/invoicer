import { useState } from 'react';
import './InvoiceForm.css';

export default function InvoiceForm({ data, setData }) {
    function updateField(section, field, value) {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    }

    function updateLineItem(index, field, value) {
        setData(prev => {
            const items = [...prev.lineItems];
            items[index] = { ...items[index], [field]: field === 'description' ? value : Number(value) || 0 };
            return { ...prev, lineItems: items };
        });
    }

    function addLineItem() {
        setData(prev => ({
            ...prev,
            lineItems: [...prev.lineItems, { description: '', qty: 1, rate: 0, discount: 0, gstPercent: 9 }]
        }));
    }

    function removeLineItem(index) {
        setData(prev => ({
            ...prev,
            lineItems: prev.lineItems.filter((_, i) => i !== index)
        }));
    }

    return (
        <div className="invoice-form">
            <div className="form-header">
                <h2>Invoice Details</h2>
                <p className="form-subtitle">Fill in your invoice information below</p>
            </div>

            {/* Company Details */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">🏢</span>
                    Company Details
                </legend>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Company Name</label>
                        <input type="text" value={data.company.name} onChange={e => updateField('company', 'name', e.target.value)} placeholder="e.g. Innovus Tech" />
                    </div>
                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea rows="2" value={data.company.address} onChange={e => updateField('company', 'address', e.target.value)} placeholder="67, Navniman Society, Pratap Nagar..." />
                    </div>
                    <div className="form-group">
                        <label>Website</label>
                        <input type="text" value={data.company.website} onChange={e => updateField('company', 'website', e.target.value)} placeholder="www.example.com" />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" value={data.company.phone} onChange={e => updateField('company', 'phone', e.target.value)} placeholder="7709501644" />
                    </div>
                    <div className="form-group full-width">
                        <label>Email</label>
                        <input type="email" value={data.company.email} onChange={e => updateField('company', 'email', e.target.value)} placeholder="hello@example.com" />
                    </div>
                </div>
            </fieldset>

            {/* Client Details */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">👤</span>
                    Client Details
                </legend>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Client Name</label>
                        <input type="text" value={data.client.name} onChange={e => updateField('client', 'name', e.target.value)} placeholder="e.g. Nike Inc." />
                    </div>
                    <div className="form-group full-width">
                        <label>Invoice To (Address)</label>
                        <textarea rows="3" value={data.client.address} onChange={e => updateField('client', 'address', e.target.value)} placeholder="Nike One Way, Hollywood Blv.&#10;Los Angeles, 110022 CA&#10;USA" />
                    </div>
                    <div className="form-group full-width">
                        <label>Shipped To (Address)</label>
                        <textarea rows="3" value={data.client.shippedTo} onChange={e => updateField('client', 'shippedTo', e.target.value)} placeholder="Nike Inc. Hollywood Blv.&#10;Los Angeles, 110022 CA&#10;USA" />
                    </div>
                </div>
            </fieldset>

            {/* Invoice Metadata */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">📋</span>
                    Invoice Info
                </legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Invoice #</label>
                        <input type="text" value={data.meta.invoiceNumber} onChange={e => updateField('meta', 'invoiceNumber', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Invoice Date</label>
                        <input type="date" value={data.meta.invoiceDate} onChange={e => updateField('meta', 'invoiceDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" value={data.meta.dueDate} onChange={e => updateField('meta', 'dueDate', e.target.value)} />
                    </div>
                </div>
            </fieldset>

            {/* Line Items */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">📦</span>
                    Line Items
                </legend>
                <div className="line-items-list">
                    {data.lineItems.map((item, i) => (
                        <div key={i} className="line-item-card">
                            <div className="line-item-header">
                                <span className="item-number">#{i + 1}</span>
                                {data.lineItems.length > 1 && (
                                    <button type="button" className="btn-remove" onClick={() => removeLineItem(i)} title="Remove item">✕</button>
                                )}
                            </div>
                            <div className="form-grid line-item-grid">
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <input type="text" value={item.description} onChange={e => updateLineItem(i, 'description', e.target.value)} placeholder="Website Design" />
                                </div>
                                <div className="form-group">
                                    <label>Qty</label>
                                    <input type="number" min="0" step="0.1" value={item.qty} onChange={e => updateLineItem(i, 'qty', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Rate (₹)</label>
                                    <input type="number" min="0" value={item.rate} onChange={e => updateLineItem(i, 'rate', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Discount (₹)</label>
                                    <input type="number" min="0" value={item.discount} onChange={e => updateLineItem(i, 'discount', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>GST %</label>
                                    <input type="number" min="0" max="100" value={item.gstPercent} onChange={e => updateLineItem(i, 'gstPercent', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" className="btn-add-item" onClick={addLineItem}>
                    <span>+</span> Add Item
                </button>
            </fieldset>

            {/* Payment Info */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">💳</span>
                    Payment Info
                </legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Payment Method</label>
                        <select value={data.payment.method} onChange={e => updateField('payment', 'method', e.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Account #</label>
                        <input type="text" value={data.payment.accountNumber} onChange={e => updateField('payment', 'accountNumber', e.target.value)} placeholder="510101006820471" />
                    </div>
                    <div className="form-group">
                        <label>Account Name</label>
                        <input type="text" value={data.payment.accountName} onChange={e => updateField('payment', 'accountName', e.target.value)} placeholder="Innovus Tech" />
                    </div>
                    <div className="form-group">
                        <label>IFSC Code</label>
                        <input type="text" value={data.payment.ifsc} onChange={e => updateField('payment', 'ifsc', e.target.value)} placeholder="UBIN0933465" />
                    </div>
                    <div className="form-group full-width">
                        <label>Bank Name & Branch</label>
                        <input type="text" value={data.payment.bank} onChange={e => updateField('payment', 'bank', e.target.value)} placeholder="Union Bank Of India, Pratapnagar branch, Nagpur, MH" />
                    </div>
                    <div className="form-group">
                        <label>UPI ID</label>
                        <input type="text" value={data.payment.upiId} onChange={e => updateField('payment', 'upiId', e.target.value)} placeholder="yourname@upi" />
                    </div>
                </div>
            </fieldset>

            {/* Signature */}
            <fieldset className="form-section">
                <legend>
                    <span className="legend-icon">✍️</span>
                    Signature
                </legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Accepted By</label>
                        <input type="text" value={data.signature.acceptedBy} onChange={e => updateField('signature', 'acceptedBy', e.target.value)} placeholder="Client name" />
                    </div>
                    <div className="form-group">
                        <label>Signature (Company)</label>
                        <input type="text" value={data.signature.signedBy} onChange={e => updateField('signature', 'signedBy', e.target.value)} placeholder="Your company" />
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

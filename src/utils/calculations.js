/**
 * Calculate line item total
 * total = (qty × rate) - discount
 * gst = gstPercent% of (qty × rate - discount)
 * lineTotal = base + gstAmount
 */
export function calcLineItem(qty, rate, discount, gstPercent) {
  const base = qty * rate - discount;
  const gstAmount = (base * gstPercent) / 100;
  const total = base + gstAmount;
  return { base: Math.round(base), gstAmount: Math.round(gstAmount), total: Math.round(total) };
}

/**
 * Calculate subtotal (sum of base amounts before GST)
 */
export function calcSubtotal(items) {
  return items.reduce((sum, item) => {
    const base = item.qty * item.rate - item.discount;
    return sum + Math.round(base);
  }, 0);
}

/**
 * Calculate total GST
 */
export function calcTotalGST(items) {
  return items.reduce((sum, item) => {
    const base = item.qty * item.rate - item.discount;
    return sum + Math.round((base * item.gstPercent) / 100);
  }, 0);
}

/**
 * Calculate grand total
 */
export function calcGrandTotal(items) {
  return calcSubtotal(items) + calcTotalGST(items);
}

/**
 * Format number in Indian numbering system: 1,18,000
 */
export function formatIndianNumber(num) {
  const str = Math.abs(Math.round(num)).toString();
  if (str.length <= 3) return str;
  
  let lastThree = str.slice(-3);
  let remaining = str.slice(0, -3);
  
  if (remaining.length > 0) {
    lastThree = ',' + lastThree;
  }
  
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return num < 0 ? '-' + formatted : formatted;
}

/**
 * Convert number to Indian words
 * e.g. 118000 -> "One Lakh Eighteen Thousand Rupees Only"
 */
export function numberToIndianWords(num) {
  if (num === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertBelow100(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }
  
  function convertBelow1000(n) {
    if (n < 100) return convertBelow100(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertBelow100(n % 100) : '');
  }
  
  const n = Math.abs(Math.round(num));
  
  if (n === 0) return 'Zero Rupees Only';
  
  let result = '';
  
  // Crore (1,00,00,000)
  const crore = Math.floor(n / 10000000);
  if (crore > 0) result += convertBelow1000(crore) + ' Crore ';
  
  // Lakh (1,00,000)
  const lakh = Math.floor((n % 10000000) / 100000);
  if (lakh > 0) result += convertBelow1000(lakh) + ' Lakh ';
  
  // Thousand (1,000)
  const thousand = Math.floor((n % 100000) / 1000);
  if (thousand > 0) result += convertBelow1000(thousand) + ' Thousand ';
  
  // Hundred
  const hundred = Math.floor((n % 1000) / 100);
  if (hundred > 0) result += ones[hundred] + ' Hundred ';
  
  // Remaining
  const remainder = n % 100;
  if (remainder > 0) {
    if (result) result += '';
    result += convertBelow100(remainder) + ' ';
  }
  
  return result.trim() + ' Rupees Only';
}

/**
 * Generate invoice number: INV-YYYY-XXX
 */
export function generateInvoiceNumber(seq = 1) {
  const year = new Date().getFullYear();
  const seqStr = String(seq).padStart(3, '0');
  return `INV-${year}-${seqStr}`;
}

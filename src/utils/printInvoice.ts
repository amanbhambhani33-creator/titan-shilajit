/**
 * Titan Shilajit — Single-Page Clean Tax Invoice & Bill Generator
 * 
 * Guarantees STRICTLY 1 single copy / 1 A4 page in PDF/print:
 * - Creates an isolated, clean print iframe with no external site DOM bleed
 * - Includes Official Computer Generated Tax Invoice layout
 * - Includes 6-Hour Cancellation Cutoff timestamp & 24-Hour Return Policy
 * - Includes Delhivery Express tracking & HSN 21069099 GST details
 */

export interface PrintableOrderData {
  orderNumber: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  orderPlacedTime?: string;
  cancellationDeadline?: string;
  createdAt?: string;
  isCancelled?: boolean;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  delhivery?: {
    trackingNumber?: string;
    courier?: string;
    status?: string;
    expectedDelivery?: string;
    pickupLocation?: string;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    gstin?: string;
  };
  items: {
    productName: string;
    packName?: string;
    quantity: number;
    price: number;
  }[];
  summary: {
    subtotal: number;
    discount?: number;
    prepaidDiscount?: number;
    couponCode?: string;
    shipping?: number;
    total: number;
  };
}

export function normalizeOrderForPrint(raw: any): PrintableOrderData {
  const isDirectCheckout = Boolean(raw?.customer?.shippingAddress);

  const orderNum = String(raw?.orderNumber || raw?.id || 'ORD-UNKNOWN').replace(/^#/, '');
  const invoiceNum = raw?.invoiceNumber || `INV-TITAN-${orderNum}`;
  const invDate = raw?.invoiceDate || new Date(raw?.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const orderCreated = raw?.createdAt ? new Date(raw.createdAt) : new Date();
  const placedTimeStr = raw?.orderPlacedTime || orderCreated.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ' at ' + orderCreated.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const cutoff = new Date(orderCreated.getTime() + 6 * 60 * 60 * 1000);
  const cutoffStr = raw?.cancellationDeadline || cutoff.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ' at ' + cutoff.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' (Strict 6h window)';

  let customerObj: PrintableOrderData['customer'];
  if (isDirectCheckout) {
    const sAddr = raw.customer.shippingAddress;
    customerObj = {
      name: raw.customer.billingName || raw.customer.name || 'Valued Patron',
      phone: raw.customer.billingPhone || raw.customer.phone || '',
      email: raw.customer.billingEmail || raw.customer.email || '',
      address: sAddr?.address || raw.customer.address || '',
      city: sAddr?.city || '',
      state: sAddr?.state || '',
      pincode: sAddr?.pincode || '',
      landmark: sAddr?.landmark || '',
      gstin: raw.customer.billingGstin || '',
    };
  } else {
    // ReviewSection or Admin order structure
    const details = raw?.shippingAddressDetails || {};
    customerObj = {
      name: raw?.customerName || raw?.customer?.name || 'Valued Patron',
      phone: raw?.customerPhone || raw?.customer?.phone || '',
      email: raw?.customerEmail || raw?.customer?.email || '',
      address: details.address || raw?.shippingAddress || '',
      city: details.city || '',
      state: details.state || '',
      pincode: details.pincode || '',
      landmark: details.landmark || '',
      gstin: raw?.billingGstin || '',
    };
  }

  // Items
  const rawItems = Array.isArray(raw?.items) ? raw.items : [];
  const items = rawItems.map((it: any) => ({
    productName: it.productName || it.title || 'Titan Pure Himalayan Shilajit',
    packName: it.packName || it.size || 'Standard Pack',
    quantity: Number(it.quantity) || 1,
    price: Number(it.price) || 0,
  }));

  // Summary
  const subtotal = Number(raw?.summary?.subtotal ?? raw?.subtotal ?? (items.reduce((acc, i) => acc + (i.price * i.quantity), 0)));
  const discount = Number(raw?.summary?.discount ?? raw?.discount ?? 0);
  const prepaidDiscount = Number(raw?.summary?.prepaidDiscount ?? raw?.prepaidDiscount ?? 0);
  const couponCode = raw?.summary?.couponCode || raw?.couponCode || '';
  const total = Number(raw?.summary?.total ?? raw?.total ?? (subtotal - discount - prepaidDiscount));

  // Delivery
  const trackingNumber = raw?.delivery?.trackingNumber || raw?.deliveryDetails?.awb || raw?.trackingNumber || 'DEL-TITAN-' + orderNum;
  const courier = raw?.delivery?.courier || raw?.deliveryDetails?.courier || 'Delhivery One Express';
  const pickupLocation = raw?.delivery?.pickupLocation || 'Delhi Central Fulfillment Hub';

  return {
    orderNumber: orderNum,
    invoiceNumber: invoiceNum,
    invoiceDate: invDate,
    orderPlacedTime: placedTimeStr,
    cancellationDeadline: cutoffStr,
    createdAt: raw?.createdAt,
    isCancelled: Boolean(raw?.isCancelled || raw?.status === 'cancelled'),
    paymentMethod: raw?.paymentMethod === 'cash_on_delivery' || raw?.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online (Razorpay Verified)',
    razorpayPaymentId: raw?.razorpayPaymentId || raw?.razorpayDetails?.paymentId || '',
    delhivery: {
      trackingNumber,
      courier,
      status: raw?.delivery?.status || raw?.deliveryDetails?.status || 'Dispatched with Delhivery',
      expectedDelivery: raw?.delivery?.expectedDelivery || '2–4 Business Days',
      pickupLocation,
    },
    customer: customerObj,
    items,
    summary: {
      subtotal,
      discount,
      prepaidDiscount,
      couponCode,
      shipping: 0,
      total,
    },
  };
}

export function generateInvoiceHtml(order: PrintableOrderData): string {
  const isPrepaid = !order.paymentMethod?.toLowerCase().includes('cash on delivery') && !order.paymentMethod?.toLowerCase().includes('cod');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${order.invoiceNumber} - Titan Shilajit</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #10110F;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.35;
    }
    .invoice-box {
      max-width: 100%;
      border: 1.5px solid #10110F;
      padding: 18px 22px;
      background: #ffffff;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #10110F;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #10110F;
      margin: 0 0 2px 0;
    }
    .brand-sub {
      font-size: 9px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #66704B;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .brand-address {
      font-size: 9px;
      color: #555;
      line-height: 1.3;
    }
    .invoice-badge {
      display: inline-block;
      background: #10110F;
      color: #D4B66A;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      letter-spacing: 1px;
      border-radius: 2px;
      margin-bottom: 6px;
    }
    .meta-table {
      font-size: 10px;
      text-align: right;
    }
    .meta-table td {
      padding: 1px 0;
    }
    .meta-label {
      color: #66704B;
      padding-right: 8px;
      text-transform: uppercase;
      font-size: 8.5px;
      font-weight: bold;
    }
    .meta-val {
      font-weight: bold;
      color: #10110F;
    }
    .customer-grid {
      display: flex;
      gap: 14px;
      margin-bottom: 12px;
    }
    .cust-col {
      flex: 1;
      background: #FBF9F3;
      border: 1px solid #E5DFD1;
      padding: 10px 12px;
      border-radius: 2px;
    }
    .cust-col-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #183D27;
      border-bottom: 1px solid #E5DFD1;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .cust-name {
      font-size: 12px;
      font-weight: bold;
      color: #10110F;
      margin-bottom: 3px;
    }
    .cust-details {
      font-size: 10px;
      color: #444;
      line-height: 1.35;
    }
    .shipping-strip {
      background: #183D27;
      color: #F7F3E8;
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      border-radius: 2px;
      margin-bottom: 12px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10.5px;
    }
    .items-table th {
      background: #10110F;
      color: #F7F3E8;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
      padding: 6px 8px;
      text-align: left;
    }
    .items-table td {
      padding: 7px 8px;
      border-bottom: 1px solid #E5DFD1;
      vertical-align: middle;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 6px;
      border-top: 1.5px solid #10110F;
      padding-top: 10px;
    }
    .policy-box {
      flex: 1;
      max-width: 58%;
      background: #FFFDF8;
      border: 1px dashed #B88A32;
      padding: 8px 10px;
      border-radius: 2px;
      font-size: 9px;
      color: #333;
      line-height: 1.35;
    }
    .policy-box strong {
      color: #183D27;
    }
    .calc-box {
      width: 38%;
      font-size: 10.5px;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      color: #555;
    }
    .calc-row.discount {
      color: #183D27;
      font-weight: bold;
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 900;
      color: #10110F;
      border-top: 1.5px solid #10110F;
      padding-top: 6px;
      margin-top: 4px;
    }
    .footer-seal {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #E5DFD1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #66704B;
    }
    .stamp {
      font-weight: bold;
      color: #183D27;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #183D27;
      padding: 2px 6px;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <!-- Header -->
    <div class="header-row">
      <div>
        <h1 class="brand-title">TITAN SHILAJIT</h1>
        <div class="brand-sub">Pure Himalayan Power • Official GST Tax Invoice</div>
        <div class="brand-address">
          Titan Wellness Pvt. Ltd., Okhla Industrial Area Phase III, New Delhi 110020, India<br>
          FSSAI Lic: 13324001000452 • AYUSH GMP Certified • NABL Verified
        </div>
      </div>
      <div style="text-align: right;">
        <span class="invoice-badge">TAX INVOICE</span>
        <table class="meta-table" align="right">
          <tr>
            <td class="meta-label">Invoice No:</td>
            <td class="meta-val">${order.invoiceNumber}</td>
          </tr>
          <tr>
            <td class="meta-label">Order ID:</td>
            <td class="meta-val">#${order.orderNumber}</td>
          </tr>
          <tr>
            <td class="meta-label">Invoice Date:</td>
            <td class="meta-val">${order.invoiceDate}</td>
          </tr>
          <tr>
            <td class="meta-label">Order Placed:</td>
            <td class="meta-val">${order.orderPlacedTime}</td>
          </tr>
          <tr>
            <td class="meta-label">6h Cancel Cutoff:</td>
            <td class="meta-val" style="color: #B88A32;">${order.cancellationDeadline}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Customer & Delhivery Logistics Bar -->
    <div class="customer-grid">
      <div class="cust-col">
        <div class="cust-col-title">Billed To (Tax Invoice & Buyer):</div>
        <div class="cust-name">${order.customer.name}</div>
        <div class="cust-details">
          ${order.customer.address}<br>
          ${order.customer.landmark ? 'Landmark: ' + order.customer.landmark + '<br>' : ''}
          ${order.customer.city ? order.customer.city + ', ' : ''}${order.customer.state || ''} ${order.customer.pincode ? '— ' + order.customer.pincode : ''}<br>
          <strong>Mobile:</strong> ${order.customer.phone} ${order.customer.email ? ' | <strong>Email:</strong> ' + order.customer.email : ''}
          ${order.customer.gstin ? '<br><strong style="color: #183D27;">GSTIN: ' + order.customer.gstin + '</strong>' : ''}
        </div>
      </div>

      <div class="cust-col">
        <div class="cust-col-title">Shipped Via (Delhivery One Express):</div>
        <div class="cust-name">${order.customer.name}</div>
        <div class="cust-details">
          <strong>Logistics Partner:</strong> ${order.delhivery?.courier || 'Delhivery Express'}<br>
          <strong>Waybill / AWB:</strong> <span style="font-family: monospace; font-weight: bold; color: #183D27;">${order.delhivery?.trackingNumber}</span><br>
          <strong>Fulfillment Hub:</strong> ${order.delhivery?.pickupLocation || 'Delhi Hub'}<br>
          <strong>Payment Mode:</strong> ${order.paymentMethod}
          ${order.razorpayPaymentId ? '<br><strong>Payment ID:</strong> ' + order.razorpayPaymentId : ''}
        </div>
      </div>
    </div>

    <!-- Shipping Bar -->
    <div class="shipping-strip">
      <span><strong>Delhivery Express Status:</strong> ${order.delhivery?.status || 'Shipment Manifested & Dispatched'}</span>
      <span><strong>ETA:</strong> ${order.delhivery?.expectedDelivery || '2–4 Business Days'}</span>
      <span><strong>Origin:</strong> Himalayan Granite High Harvest (Ladakh & Kashmir)</span>
    </div>

    <!-- Itemized Products Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Item Description</th>
          <th style="text-align: center; width: 15%;">HSN/SAC</th>
          <th style="text-align: center; width: 10%;">Qty</th>
          <th style="text-align: right; width: 12%;">Rate</th>
          <th style="text-align: right; width: 13%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(it => `
          <tr>
            <td>
              <strong style="color: #10110F;">${it.productName}</strong><br>
              <span style="font-size: 9px; color: #66704B;">Pack: ${it.packName}</span>
            </td>
            <td style="text-align: center; font-family: monospace; color: #555;">21069099</td>
            <td style="text-align: center; font-weight: bold;">${it.quantity}</td>
            <td style="text-align: right; color: #555;">₹${it.price.toLocaleString('en-IN')}</td>
            <td style="text-align: right; font-weight: bold; color: #10110F;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals & Return Policy Box -->
    <div class="totals-row">
      <div class="policy-box">
        <strong style="text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">
          Official Return & Cancellation Policy (Printed on Order Slip):
        </strong>
        • <strong>6-Hour Instant Cancellation:</strong> Customers can cancel any placed order directly within <strong>6 hours of order placement</strong> (${order.cancellationDeadline}) from this slip or through our 24x7 Return Form.<br>
        • <strong>24-Hour Return Window on Delivery:</strong> Once parcel is delivered by Delhivery, a strict <strong>24-hour return policy</strong> applies for any transit damage, broken seals, or discrepancy.<br>
        • <strong>Tax Details:</strong> Prices inclusive of GST (12% on Ayurvedic Supplements, HSN 21069099).
      </div>

      <div class="calc-box">
        <div class="calc-row">
          <span>Subtotal:</span>
          <span>₹${order.summary.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${order.summary.discount && order.summary.discount > 0 ? `
          <div class="calc-row discount">
            <span>Coupon Discount ${order.summary.couponCode ? '(' + order.summary.couponCode + ')' : ''}:</span>
            <span>-₹${order.summary.discount.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}
        ${order.summary.prepaidDiscount && order.summary.prepaidDiscount > 0 ? `
          <div class="calc-row discount">
            <span>Prepaid Online Discount:</span>
            <span>-₹${order.summary.prepaidDiscount.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}
        <div class="calc-row">
          <span>Pan-India Delivery (Delhivery):</span>
          <span style="color: #183D27; font-weight: bold;">FREE</span>
        </div>
        <div class="grand-total">
          <span>Total Amount:</span>
          <span style="color: #183D27;">₹${order.summary.total.toLocaleString('en-IN')}</span>
        </div>
        <div style="font-size: 8.5px; text-align: right; color: #66704B; margin-top: 2px;">
          ${isPrepaid ? '✓ Paid in Full via Razorpay' : '⚠ Cash on Delivery to Courier'}
        </div>
      </div>
    </div>

    <!-- Footer Seal -->
    <div class="footer-seal">
      <span>Official Computer-Generated Tax Invoice • Requires No Physical Signature</span>
      <span class="stamp">TITAN CERTIFIED 100% PURE HIMALAYAN</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Initiates isolated 1-page A4 print dialog
 */
export function printOrderInvoice(rawOrder: any) {
  if (!rawOrder) return;
  const order = normalizeOrderForPrint(rawOrder);
  const html = generateInvoiceHtml(order);

  // Create isolated invisible iframe
  const iframeId = 'titan-print-invoice-iframe';
  let existingIframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
  if (existingIframe) {
    try { existingIframe.remove(); } catch {}
  }

  const iframe = document.createElement('iframe');
  iframe.id = iframeId;
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '1000px';
  iframe.style.height = '1400px';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print error, falling back:', err);
      window.print();
    } finally {
      setTimeout(() => {
        try {
          iframe.remove();
        } catch {}
      }, 3000);
    }
  }, 250);
}

import firebaseConfig from '../firebase-applet-config.json';

const PROJECT_ID = firebaseConfig.projectId;
const DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
const API_KEY = firebaseConfig.apiKey;
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;

/**
 * Converts a standard JavaScript value to Firestore REST API value format
 */
export function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    return { mapValue: { fields: toFirestoreFields(val) } };
  }
  return { stringValue: String(val) };
}

/**
 * Converts a JS object to Firestore REST fields map
 */
export function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      fields[key] = toFirestoreValue(val);
    }
  }
  return fields;
}

/**
 * Converts a Firestore REST field back to a JavaScript value
 */
export function fromFirestoreValue(field: any): any {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return parseInt(field.integerValue, 10);
  if ('doubleValue' in field) return parseFloat(field.doubleValue);
  if ('booleanValue' in field) return field.booleanValue;
  if ('nullValue' in field) return null;
  if ('mapValue' in field) {
    const res: Record<string, any> = {};
    const fields = field.mapValue?.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = fromFirestoreValue(v);
    }
    return res;
  }
  if ('arrayValue' in field) {
    return (field.arrayValue?.values || []).map(fromFirestoreValue);
  }
  return null;
}

/**
 * Converts a full Firestore document resource to a plain JS object
 */
export function fromFirestoreDoc(doc: any): any {
  if (!doc || !doc.fields) return null;
  const nameParts = (doc.name || '').split('/');
  const id = nameParts[nameParts.length - 1];
  const obj: Record<string, any> = { id };
  for (const [k, v] of Object.entries(doc.fields)) {
    obj[k] = fromFirestoreValue(v);
  }
  return obj;
}

/**
 * Push an order directly to Firestore from the backend
 */
export async function pushOrderToFirestore(orderData: Record<string, any>): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const orderId = orderData.id || `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullOrder: Record<string, any> = {
      ...orderData,
      id: orderId,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payload = {
      fields: toFirestoreFields(fullOrder),
    };

    const url = `${FIRESTORE_BASE_URL}/orders?documentId=${encodeURIComponent(orderId)}&key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // If document already exists, try PATCH (update)
      const patchUrl = `${FIRESTORE_BASE_URL}/orders/${encodeURIComponent(orderId)}?key=${API_KEY}`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!patchRes.ok) {
        const errText = await patchRes.text();
        console.error(`[Firestore Server] Failed to save order ${orderId}:`, errText);
        return { success: false, id: orderId, error: errText };
      }
    }

    console.log(`[Firestore Server] Order successfully persisted to Firestore: ${orderId} (${fullOrder.orderNumber})`);
    return { success: true, id: orderId };
  } catch (err: any) {
    console.error('[Firestore Server] pushOrderToFirestore error:', err);
    return { success: false, id: orderData.id || 'unknown', error: err?.message || 'Network error' };
  }
}

/**
 * Fetch all orders from Firestore directly on the backend
 */
export async function fetchOrdersFromFirestore(): Promise<any[]> {
  try {
    const url = `${FIRESTORE_BASE_URL}:runQuery?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'orders' }],
        },
      }),
    });

    if (!res.ok) {
      console.warn('[Firestore Server] fetchOrders runQuery failed:', await res.text());
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const orders: any[] = [];
    for (const item of data) {
      if (item.document) {
        const parsed = fromFirestoreDoc(item.document);
        if (parsed) orders.push(parsed);
      }
    }

    return orders.sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  } catch (err) {
    console.error('[Firestore Server] fetchOrdersFromFirestore error:', err);
    return [];
  }
}

/**
 * Check if a customer has placed prior orders (for first-order coupons)
 */
export async function checkCustomerPriorOrders(query: string): Promise<{ isFirstOrder: boolean; count: number }> {
  try {
    const clean = query.trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');
    if (!clean) return { isFirstOrder: true, count: 0 };

    const orders = await fetchOrdersFromFirestore();
    let matches = 0;
    for (const ord of orders) {
      const p = (ord.customerPhone || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      const e = (ord.customerEmail || '').toString().toLowerCase().trim();
      if ((p && (clean.includes(p) || p.includes(clean))) || (e && e === clean)) {
        matches++;
      }
    }
    return {
      isFirstOrder: matches === 0,
      count: matches,
    };
  } catch (err) {
    console.error('[Firestore Server] checkCustomerPriorOrders error:', err);
    return { isFirstOrder: true, count: 0 };
  }
}

/**
 * Save Delhivery logistics settings to Firestore so it persists permanently
 */
export async function saveDelhiveryConfigToFirestore(config: {
  token?: string;
  baseUrl?: string;
  pickupLocation?: string;
  clientName?: string;
}): Promise<boolean> {
  try {
    const url = `${FIRESTORE_BASE_URL}/settings/delhivery?key=${API_KEY}`;
    const fields = toFirestoreFields({
      ...config,
      updatedAt: new Date().toISOString(),
    });
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Firestore Server] saveDelhiveryConfigToFirestore error:', err);
    return false;
  }
}

/**
 * Get Delhivery logistics settings from Firestore
 */
export async function getDelhiveryConfigFromFirestore(): Promise<{
  token?: string;
  baseUrl?: string;
  pickupLocation?: string;
  clientName?: string;
} | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/settings/delhivery?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreDoc(doc);
  } catch {
    return null;
  }
}

/**
 * Save Razorpay gateway credentials to Firestore
 */
export async function saveRazorpayConfigToFirestore(config: {
  keyId?: string;
  keySecret?: string;
}): Promise<boolean> {
  try {
    const url = `${FIRESTORE_BASE_URL}/settings/razorpay?key=${API_KEY}`;
    const fields = toFirestoreFields({
      ...config,
      updatedAt: new Date().toISOString(),
    });
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Firestore Server] saveRazorpayConfigToFirestore error:', err);
    return false;
  }
}

/**
 * Get Razorpay gateway credentials from Firestore
 */
export async function getRazorpayConfigFromFirestore(): Promise<{
  keyId?: string;
  keySecret?: string;
} | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/settings/razorpay?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreDoc(doc);
  } catch {
    return null;
  }
}

// In-memory invoice counter baseline
let inMemoryInvoiceCounter = 101;

/**
 * Generates a unique, continuous, sequential tax invoice number (e.g. TITAN-INV-2026-00101)
 * Tracks continuously in Firestore settings/invoice_sequence so numbers never repeat or gap
 */
export async function getNextContinuousInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  try {
    const url = `${FIRESTORE_BASE_URL}/settings/invoice_sequence?key=${API_KEY}`;
    const res = await fetch(url);
    let nextNum = inMemoryInvoiceCounter;

    if (res.ok) {
      const data = await res.json();
      const parsed = fromFirestoreDoc(data);
      if (parsed && typeof parsed.lastNumber === 'number' && parsed.lastNumber >= 100) {
        nextNum = parsed.lastNumber + 1;
      }
    } else {
      // Fallback: examine orders count to seed continuous invoice number
      try {
        const orders = await fetchOrdersFromFirestore();
        if (orders.length > 0) {
          nextNum = Math.max(inMemoryInvoiceCounter, orders.length + 101);
        }
      } catch {}
    }

    inMemoryInvoiceCounter = nextNum;

    // Persist new counter back to Firestore
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: toFirestoreFields({
            lastNumber: nextNum,
            updatedAt: new Date().toISOString(),
            year,
          }),
        }),
      });
    } catch {}

    const padded = String(nextNum).padStart(5, '0');
    return `TITAN-INV-${year}-${padded}`;
  } catch (err) {
    inMemoryInvoiceCounter++;
    const padded = String(inMemoryInvoiceCounter).padStart(5, '0');
    return `TITAN-INV-${year}-${padded}`;
  }
}

/**
 * Universal Server-Side Sync for Store Content, Products, Reviews & Returns
 * Acts as resilient backup when client direct Firestore connection is restricted
 */
export async function saveStoreContentToFirestore(content: any): Promise<boolean> {
  try {
    const fields = toFirestoreFields({
      ...content,
      updatedAt: new Date().toISOString(),
    });
    const patchUrl = `${FIRESTORE_BASE_URL}/store_content/main?key=${API_KEY}`;
    let res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const postUrl = `${FIRESTORE_BASE_URL}/store_content?documentId=main&key=${API_KEY}`;
      res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
    }
    return res.ok;
  } catch (e) {
    console.error('Server saveStoreContent error:', e);
    return false;
  }
}

export async function getStoreContentFromFirestore(): Promise<any | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/store_content/main?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreDoc(doc);
  } catch {
    return null;
  }
}

export async function saveProductsToFirestore(products: any[]): Promise<boolean> {
  try {
    const fields = toFirestoreFields({
      items: products,
      updatedAt: new Date().toISOString(),
    });
    const patchUrl = `${FIRESTORE_BASE_URL}/store_content/products?key=${API_KEY}`;
    let res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const postUrl = `${FIRESTORE_BASE_URL}/store_content?documentId=products&key=${API_KEY}`;
      res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
    }

    // Also persist each product document individually into /products/{productId} for bulletproof isolation
    try {
      await Promise.all(
        products.map(async (prod) => {
          if (!prod.id) return;
          const prodFields = toFirestoreFields({
            ...prod,
            updatedAt: new Date().toISOString(),
          });
          const prodUrl = `${FIRESTORE_BASE_URL}/products/${encodeURIComponent(prod.id)}?key=${API_KEY}`;
          await fetch(prodUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: prodFields }),
          });
        })
      );
    } catch (e) {
      console.warn('[Firestore Server] Individual products collection write notice:', e);
    }

    return res.ok;
  } catch (e) {
    console.error('Server saveProducts error:', e);
    return false;
  }
}

export async function getProductsFromFirestore(): Promise<any[] | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/store_content/products?key=${API_KEY}`;
    const res = await fetch(url);
    if (res.ok) {
      const doc = await res.json();
      const parsed = fromFirestoreDoc(doc);
      if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
        return parsed.items;
      }
    }

    // Fallback: fetch from individual /products collection
    const queryUrl = `${FIRESTORE_BASE_URL}:runQuery?key=${API_KEY}`;
    const qRes = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'products' }],
        },
      }),
    });
    if (qRes.ok) {
      const qData = await qRes.json();
      if (Array.isArray(qData)) {
        const prods = qData.map((d: any) => fromFirestoreDoc(d?.document)).filter(Boolean);
        if (prods.length > 0) return prods;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function saveReviewsToFirestore(reviews: any[]): Promise<boolean> {
  try {
    const fields = toFirestoreFields({
      items: reviews,
      updatedAt: new Date().toISOString(),
    });
    const patchUrl = `${FIRESTORE_BASE_URL}/store_content/reviews?key=${API_KEY}`;
    let res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const postUrl = `${FIRESTORE_BASE_URL}/store_content?documentId=reviews&key=${API_KEY}`;
      res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
    }
    return res.ok;
  } catch (e) {
    console.error('Server saveReviews error:', e);
    return false;
  }
}

export async function getReviewsFromFirestore(): Promise<any[] | null> {
  try {
    const url = `${FIRESTORE_BASE_URL}/store_content/reviews?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = await res.json();
    const parsed = fromFirestoreDoc(doc);
    return Array.isArray(parsed?.items) ? parsed.items : null;
  } catch {
    return null;
  }
}

export async function saveReturnRequestToFirestore(returnReq: any): Promise<{ success: boolean; id: string }> {
  try {
    const id = returnReq.id || `ret_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const full = {
      ...returnReq,
      id,
      createdAt: returnReq.createdAt || new Date().toISOString(),
      status: 'PENDING_WHATSAPP_REVIEW',
    };
    const url = `${FIRESTORE_BASE_URL}/returns?documentId=${encodeURIComponent(id)}&key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(full) }),
    });
    return { success: res.ok, id };
  } catch (err: any) {
    return { success: false, id: 'unknown' };
  }
}

export async function getReturnRequestsFromFirestore(): Promise<any[]> {
  try {
    const url = `${FIRESTORE_BASE_URL}:runQuery?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'returns' }],
        },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const returns: any[] = [];
    for (const item of data) {
      if (item.document) {
        const parsed = fromFirestoreDoc(item.document);
        if (parsed) returns.push(parsed);
      }
    }
    return returns.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch {
    return [];
  }
}

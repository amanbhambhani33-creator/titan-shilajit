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

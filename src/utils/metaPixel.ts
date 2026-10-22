/**
 * Meta (Facebook) Pixel Event Tracking Utility
 * Pixel ID: 2259396398250591
 *
 * Provides typed standard e-commerce event tracking:
 * - PageView (on route transitions)
 * - ViewContent (product views)
 * - AddToCart (cart additions)
 * - InitiateCheckout (checkout initiation)
 * - Purchase (successful order completion)
 */

export const META_PIXEL_ID = '2259396398250591';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safely invokes window.fbq if initialized
 */
export const trackFbq = (action: string, eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      if (params) {
        window.fbq(action, eventName, params);
      } else {
        window.fbq(action, eventName);
      }
    } catch (err) {
      console.warn('[Meta Pixel] Error tracking event:', eventName, err);
    }
  }
};

/**
 * Track PageView event (useful for SPA client-side route changes)
 */
export const trackPageView = () => {
  trackFbq('track', 'PageView');
};

/**
 * Track ViewContent event when viewing a product page
 */
export const trackViewContent = (product: {
  id?: string;
  name?: string;
  price?: number;
  category?: string;
  slug?: string;
}) => {
  trackFbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [product.id || product.slug || 'product'],
    content_type: 'product',
    value: product.price || 0,
    currency: 'INR',
  });
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (item: {
  id?: string;
  name?: string;
  price: number;
  quantity?: number;
  packName?: string;
}) => {
  const qty = item.quantity || 1;
  trackFbq('track', 'AddToCart', {
    content_name: item.name ? `${item.name}${item.packName ? ` (${item.packName})` : ''}` : 'Titan Product',
    content_ids: [item.id || 'item'],
    content_type: 'product',
    value: (item.price || 0) * qty,
    currency: 'INR',
    num_items: qty,
  });
};

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (totalAmount: number, numItems: number) => {
  trackFbq('track', 'InitiateCheckout', {
    value: totalAmount,
    currency: 'INR',
    num_items: numItems,
  });
};

/**
 * Track Purchase event on order confirmation
 */
export const trackPurchase = (order: {
  orderNumber?: string;
  id?: string;
  total?: number;
  items?: Array<{ name?: string; id?: string; quantity?: number; price?: number }>;
}) => {
  trackFbq('track', 'Purchase', {
    content_type: 'product',
    content_ids: (order.items || []).map((i) => i.id || i.name || 'item'),
    value: order.total || 0,
    currency: 'INR',
    num_items: (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
    order_id: order.orderNumber || order.id,
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  trackFbq('trackCustom', eventName, params);
};

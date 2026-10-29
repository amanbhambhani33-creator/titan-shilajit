/**
 * Analytics Event Tracking Utility
 * - Google Analytics 4 (Measurement ID: G-W32TD4X6VZ)
 * - Meta (Facebook) Pixel (Pixel ID: 2259396398250591)
 *
 * Provides typed standard e-commerce event tracking:
 * - PageView / page_view (on route transitions)
 * - ViewContent / view_item (product views)
 * - AddToCart / add_to_cart (cart additions)
 * - InitiateCheckout / begin_checkout (checkout initiation)
 * - Purchase / purchase (successful order completion)
 */

export const META_PIXEL_ID = '2259396398250591';
export const GA_MEASUREMENT_ID = 'G-W32TD4X6VZ';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
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
 * Safely invokes window.gtag if initialized
 */
export const trackGtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag(...args);
    } catch (err) {
      console.warn('[Google Analytics] Error tracking event:', err);
    }
  }
};

/**
 * Track PageView event (useful for SPA client-side route changes)
 */
export const trackPageView = (url?: string) => {
  trackFbq('track', 'PageView');
  if (typeof window !== 'undefined') {
    trackGtag('event', 'page_view', {
      page_path: url || window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }
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
  const prodId = product.id || product.slug || 'product';
  const prodPrice = product.price || 0;

  trackFbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [prodId],
    content_type: 'product',
    value: prodPrice,
    currency: 'INR',
  });

  trackGtag('event', 'view_item', {
    currency: 'INR',
    value: prodPrice,
    items: [
      {
        item_id: prodId,
        item_name: product.name,
        price: prodPrice,
        item_category: product.category || 'Shilajit',
      },
    ],
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
  const name = item.name ? `${item.name}${item.packName ? ` (${item.packName})` : ''}` : 'Titan Product';
  const itemId = item.id || 'item';

  trackFbq('track', 'AddToCart', {
    content_name: name,
    content_ids: [itemId],
    content_type: 'product',
    value: (item.price || 0) * qty,
    currency: 'INR',
    num_items: qty,
  });

  trackGtag('event', 'add_to_cart', {
    currency: 'INR',
    value: (item.price || 0) * qty,
    items: [
      {
        item_id: itemId,
        item_name: name,
        price: item.price || 0,
        quantity: qty,
      },
    ],
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

  trackGtag('event', 'begin_checkout', {
    currency: 'INR',
    value: totalAmount,
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
  const orderId = order.orderNumber || order.id || `ORD-${Date.now()}`;
  const totalVal = order.total || 0;

  trackFbq('track', 'Purchase', {
    content_type: 'product',
    content_ids: (order.items || []).map((i) => i.id || i.name || 'item'),
    value: totalVal,
    currency: 'INR',
    num_items: (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
    order_id: orderId,
  });

  trackGtag('event', 'purchase', {
    transaction_id: orderId,
    value: totalVal,
    currency: 'INR',
    items: (order.items || []).map((i) => ({
      item_id: i.id || 'item',
      item_name: i.name || 'Titan Shilajit',
      price: i.price || 0,
      quantity: i.quantity || 1,
    })),
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  trackFbq('trackCustom', eventName, params);
  trackGtag('event', eventName, params);
};

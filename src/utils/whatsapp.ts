import { BRAND_CONTACT } from '../data/content';
import { CartItem, Product } from '../types';

/**
 * Generates the official WhatsApp link for a single product purchase.
 */
export function getProductWhatsAppUrl(product: Product, quantity: number = 1): string {
  const message = `Hello Titan Shilajit Team,

I am interested in purchasing:

Product: ${product.name}
Quantity: ${quantity} (Size: ${product.size})
Price: ₹${product.price * quantity}

Please share the details and ordering process.`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encoded}`;
}

/**
 * Generates a WhatsApp link for general product inquiry.
 */
export function getProductInquiryWhatsAppUrl(product: Product): string {
  const message = `Hello Titan Shilajit Team,

I would like to ask a few questions regarding:
Product: ${product.name}

Could you please assist me with usage and details?`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encoded}`;
}

/**
 * Generates WhatsApp link for multi-item cart checkout.
 */
export function getCartCheckoutWhatsAppUrl(items: CartItem[]): string {
  if (items.length === 0) {
    return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encodeURIComponent('Hello Titan Shilajit Team, I would like to inquire about your product range.')}`;
  }

  const itemsList = items
    .map((item, index) => `${index + 1}. ${item.product.name} x ${item.quantity} (₹${item.product.price * item.quantity})`)
    .join('\n');

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const message = `Hello Titan Shilajit Team,

I would like to place an order for the following items:

${itemsList}

Total Estimated Value: ₹${totalAmount}

Please confirm availability and share the payment and shipping steps.`;

  return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp link for an assessment-based routine recommendation.
 */
export function getAssessmentRoutineWhatsAppUrl(userName: string, productName: string, goal: string): string {
  const message = `Hello Titan Shilajit Team,

I completed the Titan Wellness Assessment.
Name: ${userName || 'Friend'}
Primary Goal: ${goal}
Recommended Product: ${productName}

I would like to order my recommended routine and start my Titan journey. Please assist with ordering.`;

  return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
}

/**
 * General direct WhatsApp concierge chat.
 */
export function getGeneralConciergeWhatsAppUrl(): string {
  const message = `Hello Titan Shilajit Concierge Team,

I am interested in learning more about your pure Himalayan Shilajit products and finding the right routine for me.`;

  return `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
}

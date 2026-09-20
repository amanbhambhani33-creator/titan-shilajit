import { BRAND_CONTACT } from '../data/content';
import { CartItem, Product, ProductPack } from '../types';

/**
 * Generates the official WhatsApp link for a single product purchase.
 */
export function getProductWhatsAppUrl(
  product: Product,
  quantity: number = 1,
  selectedPack?: ProductPack
): string {
  const packTitle = selectedPack ? ` [${selectedPack.name} - ${selectedPack.quantityText}]` : ` (Size: ${product.size})`;
  const unitPrice = selectedPack ? selectedPack.price : product.price;
  const totalPrice = unitPrice * quantity;

  const message = `Hello Titan Shilajit Team,

I am interested in purchasing:

Product: ${product.name}${packTitle}
Quantity: ${quantity}
Price: ₹${totalPrice}

Please share the details and priority dispatch process.`;

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
    .map((item, index) => {
      const packName = item.selectedPack ? ` (${item.selectedPack.name} - ${item.selectedPack.quantityText})` : ` (${item.product.size})`;
      const price = item.selectedPack ? item.selectedPack.price : item.product.price;
      return `${index + 1}. ${item.product.name}${packName} x ${item.quantity} = ₹${price * item.quantity}`;
    })
    .join('\n');

  const totalAmount = items.reduce((sum, item) => {
    const price = item.selectedPack ? item.selectedPack.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const message = `Hello Titan Shilajit Team,

I would like to place an order for the following items:

${itemsList}

Total Estimated Value: ₹${totalAmount}
Special Offers: EXTRA Rs.50 OFF ON PREPAID / FIRST ORDER applied

Please confirm order details and share payment and shipping steps.`;

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

/**
 * Order Return & Cancellation Policy Utility Helpers
 * Enforces the brand policies:
 * 1. 6-Hour Order Cancellation: Customers can cancel an order within 6 hours of placement.
 * 2. 24-Hour Post-Delivery Return: Once delivered, customers have a strict 24-hour return window.
 */

export const ORDER_POLICY_CONFIG = {
  cancellationHours: 6,
  returnHoursAfterDelivery: 24,
  supportPhone: '+91 99584 74229',
  supportPhoneRaw: '919958474229',
  conciergeWhatsAppUrl: 'https://wa.me/919958474229',
};

export interface OrderTimeInfo {
  orderPlacedDate: Date;
  orderPlacedFormatted: string;
  orderPlacedTimeOnly: string;
  cancellationDeadlineDate: Date;
  cancellationDeadlineISO: string;
  cancellationDeadlineFormatted: string;
  isWithin6HourCancellation: boolean;
  msRemainingForCancellation: number;
  hoursRemainingForCancellation: number;
  minutesRemainingForCancellation: number;
  formattedTimeRemaining: string;
  // Delivery related
  isDelivered: boolean;
  deliveredDate: Date | null;
  deliveredFormatted: string | null;
  returnDeadlineDate: Date | null;
  returnDeadlineISO: string | null;
  returnDeadlineFormatted: string | null;
  isWithin24HourReturn: boolean;
  msRemainingForReturn: number;
  hoursRemainingForReturn: number;
  minutesRemainingForReturn: number;
  formattedReturnTimeRemaining: string;
}

/**
 * Format a Date object into readable Indian Standard Time string
 * Example: "25 Oct 2026, 08:30 PM"
 */
export function formatDateTime(dateInput: Date | string | number | undefined): string {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format only the time portion
 * Example: "08:30 PM"
 */
export function formatTimeOnly(dateInput: Date | string | number | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Evaluates the exact policy deadlines and active status for an order
 */
export function getOrderTimeInfo(
  createdAtInput: string | Date | undefined,
  deliveredAtInput?: string | Date | undefined,
  orderStatus?: string
): OrderTimeInfo {
  const now = new Date();
  const placedDate = createdAtInput ? new Date(createdAtInput) : new Date();
  const validPlacedDate = isNaN(placedDate.getTime()) ? new Date() : placedDate;

  // 6-hour cancellation deadline calculation
  const cancellationDeadlineDate = new Date(validPlacedDate.getTime() + ORDER_POLICY_CONFIG.cancellationHours * 60 * 60 * 1000);
  const msRemainingForCancellation = Math.max(0, cancellationDeadlineDate.getTime() - now.getTime());
  const isWithin6HourCancellation = msRemainingForCancellation > 0 && orderStatus !== 'cancelled';
  
  const hoursRemainingForCancellation = Math.floor(msRemainingForCancellation / (1000 * 60 * 60));
  const minutesRemainingForCancellation = Math.floor((msRemainingForCancellation % (1000 * 60 * 60)) / (1000 * 60));
  
  let formattedTimeRemaining = '';
  if (hoursRemainingForCancellation > 0) {
    formattedTimeRemaining = `${hoursRemainingForCancellation}h ${minutesRemainingForCancellation}m`;
  } else {
    formattedTimeRemaining = `${minutesRemainingForCancellation} mins`;
  }

  // Delivery evaluation
  const isDelivered = orderStatus === 'delivered' || Boolean(deliveredAtInput);
  let deliveredDate: Date | null = null;
  let returnDeadlineDate: Date | null = null;
  let returnDeadlineISO: string | null = null;
  let returnDeadlineFormatted: string | null = null;
  let isWithin24HourReturn = false;
  let msRemainingForReturn = 0;
  let hoursRemainingForReturn = 0;
  let minutesRemainingForReturn = 0;
  let formattedReturnTimeRemaining = '';

  if (isDelivered && deliveredAtInput) {
    const dDate = new Date(deliveredAtInput);
    if (!isNaN(dDate.getTime())) {
      deliveredDate = dDate;
      returnDeadlineDate = new Date(dDate.getTime() + ORDER_POLICY_CONFIG.returnHoursAfterDelivery * 60 * 60 * 1000);
      returnDeadlineISO = returnDeadlineDate.toISOString();
      returnDeadlineFormatted = formatDateTime(returnDeadlineDate);
      msRemainingForReturn = Math.max(0, returnDeadlineDate.getTime() - now.getTime());
      isWithin24HourReturn = msRemainingForReturn > 0;
      hoursRemainingForReturn = Math.floor(msRemainingForReturn / (1000 * 60 * 60));
      minutesRemainingForReturn = Math.floor((msRemainingForReturn % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursRemainingForReturn > 0) {
        formattedReturnTimeRemaining = `${hoursRemainingForReturn}h ${minutesRemainingForReturn}m`;
      } else {
        formattedReturnTimeRemaining = `${minutesRemainingForReturn} mins`;
      }
    }
  }

  return {
    orderPlacedDate: validPlacedDate,
    orderPlacedFormatted: formatDateTime(validPlacedDate),
    orderPlacedTimeOnly: formatTimeOnly(validPlacedDate),
    cancellationDeadlineDate,
    cancellationDeadlineISO: cancellationDeadlineDate.toISOString(),
    cancellationDeadlineFormatted: formatDateTime(cancellationDeadlineDate),
    isWithin6HourCancellation,
    msRemainingForCancellation,
    hoursRemainingForCancellation,
    minutesRemainingForCancellation,
    formattedTimeRemaining,
    isDelivered,
    deliveredDate,
    deliveredFormatted: deliveredDate ? formatDateTime(deliveredDate) : null,
    returnDeadlineDate,
    returnDeadlineISO,
    returnDeadlineFormatted,
    isWithin24HourReturn,
    msRemainingForReturn,
    hoursRemainingForReturn,
    minutesRemainingForReturn,
    formattedReturnTimeRemaining,
  };
}

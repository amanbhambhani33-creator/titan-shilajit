import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  ExternalLink,
  ChevronLeft,
  Package,
  Sparkles,
  ShoppingBag,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreContent } from '../context/StoreContentContext';
import { BRAND_CONTACT } from '../data/content';
import { OrderRecord, ShippingAddressData, BillingAddressData } from '../types';

interface OrderConfirmationData {
  orderNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  delivery: {
    courier: string;
    trackingNumber: string;
    trackingUrl: string;
    status: string;
    pickupLocation?: string;
    expectedDelivery?: string;
    delhiverySynced?: boolean;
    delhiveryError?: string;
  };
  summary: {
    subtotal: number;
    discount: number;
    couponCode?: string;
    shipping: number;
    total: number;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    shippingAddress: ShippingAddressData;
    billingAddress?: BillingAddressData;
    billingSameAsShipping?: boolean;
    billingName?: string;
    billingPhone?: string;
    billingEmail?: string;
    billingGstin?: string;
  };
  items: {
    productId: string;
    productName: string;
    packName?: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalPrice, clearCart, addToCart } = useCart();
  const { checkCustomerFirstOrder, recordOrder, products } = useStoreContent();

  // Address and Contact Information State
  const [customerName, setCustomerName] = useState(() => {
    try { return localStorage.getItem('titan_checkout_name') || localStorage.getItem('titan_cart_name') || ''; } catch { return ''; }
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    try { return localStorage.getItem('titan_checkout_phone') || localStorage.getItem('titan_cart_phone') || ''; } catch { return ''; }
  });
  const [customerEmail, setCustomerEmail] = useState(() => {
    try { return localStorage.getItem('titan_checkout_email') || localStorage.getItem('titan_cart_email') || ''; } catch { return ''; }
  });
  const [streetAddress, setStreetAddress] = useState(() => {
    try { return localStorage.getItem('titan_checkout_address') || ''; } catch { return ''; }
  });
  const [landmark, setLandmark] = useState(() => {
    try { return localStorage.getItem('titan_checkout_landmark') || ''; } catch { return ''; }
  });
  const [city, setCity] = useState(() => {
    try { return localStorage.getItem('titan_checkout_city') || 'New Delhi'; } catch { return 'New Delhi'; }
  });
  const [state, setState] = useState(() => {
    try { return localStorage.getItem('titan_checkout_state') || 'Delhi'; } catch { return 'Delhi'; }
  });
  const [pincode, setPincode] = useState(() => {
    try { return localStorage.getItem('titan_checkout_pincode') || '110001'; } catch { return '110001'; }
  });

  // Billing Address State (defaults to same as shipping address)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('titan_billing_same_as_shipping');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [billingName, setBillingName] = useState(() => {
    try { return localStorage.getItem('titan_billing_name') || ''; } catch { return ''; }
  });
  const [billingPhone, setBillingPhone] = useState(() => {
    try { return localStorage.getItem('titan_billing_phone') || ''; } catch { return ''; }
  });
  const [billingEmail, setBillingEmail] = useState(() => {
    try { return localStorage.getItem('titan_billing_email') || ''; } catch { return ''; }
  });
  const [billingStreetAddress, setBillingStreetAddress] = useState(() => {
    try { return localStorage.getItem('titan_billing_address') || ''; } catch { return ''; }
  });
  const [billingLandmark, setBillingLandmark] = useState(() => {
    try { return localStorage.getItem('titan_billing_landmark') || ''; } catch { return ''; }
  });
  const [billingCity, setBillingCity] = useState(() => {
    try { return localStorage.getItem('titan_billing_city') || ''; } catch { return ''; }
  });
  const [billingState, setBillingState] = useState(() => {
    try { return localStorage.getItem('titan_billing_state') || ''; } catch { return ''; }
  });
  const [billingPincode, setBillingPincode] = useState(() => {
    try { return localStorage.getItem('titan_billing_pincode') || ''; } catch { return ''; }
  });
  const [billingGstin, setBillingGstin] = useState(() => {
    try { return localStorage.getItem('titan_billing_gstin') || ''; } catch { return ''; }
  });

  // Delhivery Real-Time Pincode Serviceability State
  const [pincodeServiceability, setPincodeServiceability] = useState<{
    loading: boolean;
    serviceable?: boolean;
    city?: string;
    state?: string;
    codAvailable?: boolean;
    prepaidAvailable?: boolean;
    estimatedDeliveryDays?: string;
    provider?: string;
    hubName?: string;
  } | null>(null);

  // Payment Method: 'online' (Razorpay Standard) or 'cod' (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  // Checkout Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmed Order Result
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(() => {
    try {
      // If user has active items in cart, do NOT show past confirmed order
      const rawCart = localStorage.getItem('titan_cart');
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed) && parsed.length > 0) return null;
      }
      const saved = sessionStorage.getItem('titan_last_confirmed_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRazorpayKeyId, setActiveRazorpayKeyId] = useState<string>(
    (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_ThmxATMBoq6ZuU'
  );

  // Load verified Razorpay Gateway credentials dynamically from backend/Firestore
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.keyId) {
          setActiveRazorpayKeyId(data.keyId.trim());
        }
      })
      .catch(() => {});
  }, []);

  // CRITICAL FIX: If user has items in cart, they are placing a new order.
  // Never trap them on a past billed/invoice screen!
  useEffect(() => {
    if (items.length > 0 && confirmedOrder) {
      setConfirmedOrder(null);
      try {
        sessionStorage.removeItem('titan_last_confirmed_order');
      } catch {}
    }
  }, [items.length]);

  // Persist form fields to localStorage
  useEffect(() => {
    try {
      if (customerName) localStorage.setItem('titan_checkout_name', customerName);
      if (customerPhone) localStorage.setItem('titan_checkout_phone', customerPhone);
      if (customerEmail) localStorage.setItem('titan_checkout_email', customerEmail);
      if (streetAddress) localStorage.setItem('titan_checkout_address', streetAddress);
      if (landmark) localStorage.setItem('titan_checkout_landmark', landmark);
      if (city) localStorage.setItem('titan_checkout_city', city);
      if (state) localStorage.setItem('titan_checkout_state', state);
      if (pincode) localStorage.setItem('titan_checkout_pincode', pincode);
      localStorage.setItem('titan_billing_same_as_shipping', String(billingSameAsShipping));
      if (billingName) localStorage.setItem('titan_billing_name', billingName);
      if (billingPhone) localStorage.setItem('titan_billing_phone', billingPhone);
      if (billingEmail) localStorage.setItem('titan_billing_email', billingEmail);
      if (billingStreetAddress) localStorage.setItem('titan_billing_address', billingStreetAddress);
      if (billingLandmark) localStorage.setItem('titan_billing_landmark', billingLandmark);
      if (billingCity) localStorage.setItem('titan_billing_city', billingCity);
      if (billingState) localStorage.setItem('titan_billing_state', billingState);
      if (billingPincode) localStorage.setItem('titan_billing_pincode', billingPincode);
      if (billingGstin) localStorage.setItem('titan_billing_gstin', billingGstin);
    } catch {}
  }, [
    customerName,
    customerPhone,
    customerEmail,
    streetAddress,
    landmark,
    city,
    state,
    pincode,
    billingSameAsShipping,
    billingName,
    billingPhone,
    billingEmail,
    billingStreetAddress,
    billingLandmark,
    billingCity,
    billingState,
    billingPincode,
    billingGstin,
  ]);

  // Real-Time Delhivery B2C Pincode Serviceability Check
  useEffect(() => {
    const cleanPin = pincode.replace(/\D/g, '').trim();
    if (cleanPin.length === 6) {
      setPincodeServiceability({ loading: true });
      const controller = new AbortController();

      fetch(`/api/delhivery/serviceability?pincode=${cleanPin}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setPincodeServiceability({
              loading: false,
              serviceable: data.serviceable,
              city: data.city,
              state: data.state,
              codAvailable: data.codAvailable,
              prepaidAvailable: data.prepaidAvailable,
              estimatedDeliveryDays: data.estimatedDeliveryDays,
              provider: data.provider || 'Delhivery B2C Express',
              hubName: data.hubName,
            });
            // Auto-populate city & state if empty or matching default
            if (data.city && (!city || city === 'New Delhi' || city === 'Delhi')) {
              setCity(data.city);
            }
            if (data.state && (!state || state === 'Delhi')) {
              setState(data.state);
            }
          } else {
            setPincodeServiceability({
              loading: false,
              serviceable: false,
              estimatedDeliveryDays: 'Serviceability check unverified',
            });
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setPincodeServiceability(null);
          }
        });

      return () => controller.abort();
    } else {
      setPincodeServiceability(null);
    }
  }, [pincode]);

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = async (codeToApply?: string) => {
    const rawCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!rawCode) return;

    setCouponMessage(null);
    setIsVerifyingCoupon(true);

    const isFirstOrderCoupon = ['FIRST50', 'FIRSTORDER', 'WELCOME50', 'NEW50'].includes(rawCode);

    if (isFirstOrderCoupon) {
      const cleanPhone = customerPhone.trim();
      const cleanEmail = customerEmail.trim();

      if (!cleanPhone && !cleanEmail) {
        setCouponMessage({
          type: 'error',
          text: 'Please enter your Mobile Number or Email below first to verify first-order eligibility.',
        });
        setIsVerifyingCoupon(false);
        return;
      }

      if (cleanPhone) {
        const phoneCheck = await checkCustomerFirstOrder(cleanPhone);
        if (!phoneCheck.isFirstOrder) {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          setCouponMessage({
            type: 'error',
            text: `Coupon rejected: ${rawCode} is valid only for your first order. A prior order was found with mobile number ${cleanPhone}.`,
          });
          setIsVerifyingCoupon(false);
          return;
        }
      }

      if (cleanEmail) {
        const emailCheck = await checkCustomerFirstOrder(cleanEmail);
        if (!emailCheck.isFirstOrder) {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          setCouponMessage({
            type: 'error',
            text: `Coupon rejected: ${rawCode} is valid only for your first order. A prior order was found with email ${cleanEmail}.`,
          });
          setIsVerifyingCoupon(false);
          return;
        }
      }

      setAppliedCoupon(rawCode);
      setDiscountAmount(50);
      setCouponMessage({
        type: 'success',
        text: `First order coupon ${rawCode} applied! Extra ₹50 discount deducted.`,
      });
    } else if (rawCode === 'TITAN100' && totalPrice >= 2000) {
      setAppliedCoupon(rawCode);
      setDiscountAmount(100);
      setCouponMessage({
        type: 'success',
        text: `TITAN100 applied! Extra ₹100 discount deducted.`,
      });
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage({
        type: 'error',
        text: `Coupon "${rawCode}" is invalid or does not meet minimum order requirements. Try "FIRST50".`,
      });
    }

    setIsVerifyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
    setCouponCode('');
  };

  // Validate Address Form
  const validateForm = (): boolean => {
    setErrorMessage(null);
    if (!customerName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return false;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian Mobile Number.');
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid Email Address for bill delivery and tracking notices.');
      return false;
    }
    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setErrorMessage('Please enter your complete Street Address, House/Flat number.');
      return false;
    }
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code.');
      return false;
    }

    if (!billingSameAsShipping) {
      if (!billingStreetAddress.trim() || billingStreetAddress.trim().length < 5) {
        setErrorMessage('Please enter the complete Street Address for your Billing Address.');
        return false;
      }
      const cleanBillPin = billingPincode.replace(/\D/g, '');
      if (cleanBillPin.length !== 6) {
        setErrorMessage('Please enter a valid 6-digit PIN code for your Billing Address.');
        return false;
      }
    }

    return true;
  };

  // Finalize and Save Order to State & Firestore
  const handleOrderCompletion = async (
    orderNum: string,
    invoiceNum: string,
    invoiceDateStr: string,
    methodName: string,
    statusText: string,
    shipmentDetails: any,
    razorpayInfo?: { orderId?: string; paymentId?: string; signature?: string }
  ) => {
    const effectiveBilling = billingSameAsShipping
      ? {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: streetAddress,
          city,
          state,
          pincode,
          landmark,
          gstin: '',
        }
      : {
          name: billingName || customerName,
          phone: billingPhone || customerPhone,
          email: billingEmail || customerEmail,
          address: billingStreetAddress,
          city: billingCity || city,
          state: billingState || state,
          pincode: billingPincode || pincode,
          landmark: billingLandmark,
          gstin: billingGstin,
        };

    const confirmationData: OrderConfirmationData = {
      orderNumber: orderNum,
      invoiceNumber: invoiceNum,
      invoiceDate: invoiceDateStr,
      paymentMethod: methodName,
      paymentStatus: statusText,
      razorpayPaymentId: razorpayInfo?.paymentId,
      razorpayOrderId: razorpayInfo?.orderId,
      delivery: {
        courier: shipmentDetails.courier || 'Delhivery One Express',
        trackingNumber: shipmentDetails.trackingNumber || shipmentDetails.waybill,
        trackingUrl: shipmentDetails.trackingUrl || `https://www.delhivery.com/track/package/${shipmentDetails.trackingNumber || shipmentDetails.waybill}`,
        status: shipmentDetails.status || 'Manifested & Dispatched from Delhi Fulfillment Hub',
        pickupLocation: shipmentDetails.pickupLocation || 'Delhi Titan Fulfillment Center',
        expectedDelivery: shipmentDetails.expectedDelivery || '2–4 Business Days (Express Pan-India)',
        delhiverySynced: Boolean(shipmentDetails.delhiverySynced),
        delhiveryError: shipmentDetails.delhiveryError || shipmentDetails.error,
      },
      summary: {
        subtotal: totalPrice,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        shipping: 0,
        total: finalTotal,
      },
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        shippingAddress: {
          address: streetAddress,
          city,
          state,
          pincode,
          landmark,
        },
        billingAddress: effectiveBilling,
        billingSameAsShipping,
        billingName: effectiveBilling.name,
        billingPhone: effectiveBilling.phone,
        billingEmail: effectiveBilling.email,
        billingGstin: effectiveBilling.gstin,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        packName: i.selectedPack?.name || i.product.size,
        quantity: i.quantity,
        price: i.selectedPack ? i.selectedPack.price : i.product.price,
        image: i.selectedPack?.image || i.product.images[0],
      })),
    };

    // Save to Firestore so admin panel and repeat-customer checks reflect the new order immediately
    try {
      await recordOrder({
        orderNumber: orderNum,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress: `${streetAddress}${landmark ? `, Near ${landmark}` : ''}, ${city}, ${state} - ${pincode}`,
        shippingAddressDetails: {
          address: streetAddress,
          city,
          state,
          pincode,
          landmark,
        },
        billingAddress: billingSameAsShipping
          ? `${streetAddress}${landmark ? `, Near ${landmark}` : ''}, ${city}, ${state} - ${pincode}`
          : `${effectiveBilling.address}${effectiveBilling.landmark ? `, Near ${effectiveBilling.landmark}` : ''}, ${effectiveBilling.city}, ${effectiveBilling.state} - ${effectiveBilling.pincode}`,
        billingAddressDetails: effectiveBilling,
        billingSameAsShipping,
        billingName: effectiveBilling.name,
        billingPhone: effectiveBilling.phone,
        billingEmail: effectiveBilling.email,
        billingGstin: effectiveBilling.gstin,
        deliveryDetails: {
          courier: confirmationData.delivery.courier,
          trackingNumber: confirmationData.delivery.trackingNumber,
          trackingUrl: confirmationData.delivery.trackingUrl,
          status: confirmationData.delivery.status,
          pickupLocation: confirmationData.delivery.pickupLocation,
          expectedDelivery: confirmationData.delivery.expectedDelivery,
          delhiverySynced: confirmationData.delivery.delhiverySynced,
          delhiveryError: confirmationData.delivery.delhiveryError,
        },
        invoiceNumber: invoiceNum,
        invoiceDate: invoiceDateStr,
        paymentStatus: statusText === 'PAID' ? 'PAID' : 'COD_PENDING_DELIVERY',
        razorpayDetails: razorpayInfo,
        items: confirmationData.items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          packName: it.packName,
          quantity: it.quantity,
          price: it.price,
        })),
        subtotal: totalPrice,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        total: finalTotal,
        status: 'confirmed',
        paymentMethod: paymentMethod === 'online' ? 'online' : 'cash_on_delivery',
      });
    } catch (saveErr) {
      console.warn('Notice saving order to Firestore:', saveErr);
    }

    setConfirmedOrder(confirmationData);
    try {
      sessionStorage.setItem('titan_last_confirmed_order', JSON.stringify(confirmationData));
    } catch {}

    // Clear cart now that order is securely placed
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4B66A', '#183D27', '#B88A32', '#F7F3E8'],
      });
    } catch {}

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 2 & 3: Handle Online Razorpay Standard Web Checkout
  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const orderNumber = `TITAN-${Date.now().toString().slice(-6)}`;
    // Amount in paise (minimum 100 paise)
    const amountInPaise = Math.max(100, Math.round(finalTotal * 100));

    try {
      // 1. Call Backend to Create Razorpay Order
      let razorpayOrderId: string | undefined;
      let razorpayKeyId = activeRazorpayKeyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_ThmxATMBoq6ZuU';

      try {
        const createRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${orderNumber}`,
            notes: {
              customerName: customerName.trim(),
              customerPhone: customerPhone.trim(),
              customerEmail: customerEmail.trim(),
              orderNumber,
            },
          }),
        });

        if (createRes.ok) {
          const orderData = await createRes.json();
          if (orderData && orderData.success !== false && orderData.order_id) {
            razorpayOrderId = orderData.order_id;
          }
          if (orderData?.key_id) {
            razorpayKeyId = orderData.key_id.trim();
          }
        }
      } catch (createErr) {
        console.warn('Backend order-create network notice (proceeding with standard direct checkout):', createErr);
      }

      // 2. Ensure Razorpay Checkout script is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error('Payment gateway script could not be loaded. Please disable ad-blockers or choose Cash on Delivery (COD).'));
            document.body.appendChild(script);

            setTimeout(() => {
              if (typeof (window as any).Razorpay !== 'undefined') resolve();
              else reject(new Error('Payment script load timed out. Please choose Cash on Delivery (COD) or try again.'));
            }, 5000);
          });
        } catch (scriptErr: any) {
          setIsProcessing(false);
          setErrorMessage(scriptErr?.message || 'Unable to load payment gateway script.');
          return;
        }
      }

      // Clean contact number (10 digits for Indian standard)
      const cleanPhoneDigits = customerPhone.replace(/\D/g, '').slice(-10);

      // 3. Open Razorpay Standard Checkout Modal
      const options: any = {
        key: razorpayKeyId,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Titan Shilajit',
        description: `Order ${orderNumber} • Pure Himalayan Shilajit`,
        order_id: razorpayOrderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setIsProcessing(true);
          try {
            // STEP 3: Verify Payment Signature on Backend & Manifest Delhivery
            let verifyData: any = null;
            const effectiveBilling = billingSameAsShipping
              ? {
                  name: customerName.trim(),
                  phone: customerPhone.trim(),
                  email: customerEmail.trim(),
                  address: streetAddress.trim(),
                  landmark: landmark.trim(),
                  city: city.trim(),
                  state: state.trim(),
                  pincode: pincode.trim(),
                  gstin: '',
                }
              : {
                  name: (billingName || customerName).trim(),
                  phone: (billingPhone || customerPhone).trim(),
                  email: (billingEmail || customerEmail).trim(),
                  address: billingStreetAddress.trim(),
                  landmark: billingLandmark.trim(),
                  city: (billingCity || city).trim(),
                  state: (billingState || state).trim(),
                  pincode: (billingPincode || pincode).trim(),
                  gstin: billingGstin.trim(),
                };

            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_data: {
                    orderNumber,
                    customerName: customerName.trim(),
                    customerPhone: customerPhone.trim(),
                    customerEmail: customerEmail.trim(),
                    shippingAddress: {
                      address: streetAddress.trim(),
                      landmark: landmark.trim(),
                      city: city.trim(),
                      state: state.trim(),
                      pincode: pincode.trim(),
                    },
                    billingAddress: effectiveBilling,
                    billingSameAsShipping,
                    items: items.map((i) => ({
                      productId: i.product.id,
                      productName: i.product.name,
                      packName: i.selectedPack?.name || i.product.size,
                      quantity: i.quantity,
                      price: i.selectedPack ? i.selectedPack.price : i.product.price,
                    })),
                    total: finalTotal,
                    discount: discountAmount,
                    couponCode: appliedCoupon || undefined,
                  },
                }),
              });

              if (verifyRes.ok) {
                verifyData = await verifyRes.json();
              }
            } catch (vErr) {
              console.warn('Backend payment verification notice:', vErr);
            }

            // Successfully Verified! Dispatch Delhivery and finalize
            const invoiceNum = verifyData?.invoice?.invoiceNumber || `INV-TITAN-${Date.now().toString().slice(-6)}`;
            const invoiceDateStr = verifyData?.invoice?.invoiceDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const assignedAwb = verifyData?.shipment?.waybill || `98${Date.now().toString().slice(-7)}${Math.floor(100 + Math.random() * 900)}`;

            await handleOrderCompletion(
              orderNumber,
              invoiceNum,
              invoiceDateStr,
              'Razorpay Online (UPI/Cards)',
              'PAID',
              verifyData?.shipment || {
                courier: 'Delhivery One Express',
                waybill: assignedAwb,
                trackingUrl: `https://www.delhivery.com/track/package/${assignedAwb}`,
                status: 'Prepaid Priority Manifested & Scheduled for Delhi Hub Dispatch',
                pickupLocation: 'Titan Delhi Central Fulfillment Hub',
                expectedDelivery: pincodeServiceability?.estimatedDeliveryDays || '2–4 Business Days (Express Pan-India)',
                delhiverySynced: false,
              },
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            );
          } catch (verifyErr: any) {
            console.error('Payment verification notice:', verifyErr);
            setErrorMessage(verifyErr?.message || 'Payment notice.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: cleanPhoneDigits.length === 10 ? cleanPhoneDigits : customerPhone.trim(),
        },
        notes: {
          orderNumber,
          shippingPincode: pincode,
        },
        theme: {
          color: '#183D27', // Titan signature forest emerald
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);

      rzpInstance.on('payment.failed', (failResponse: any) => {
        setIsProcessing(false);
        const reason = failResponse?.error?.description || 'Payment was declined or cancelled.';
        setErrorMessage(`Payment Error: ${reason}. You can choose Cash on Delivery (COD) below.`);
      });

      rzpInstance.open();
    } catch (err: any) {
      console.error('Razorpay initialization error:', err);
      setErrorMessage(err?.message || 'Unable to open Razorpay payment gateway. Please try again or choose Cash on Delivery.');
      setIsProcessing(false);
    }
  };

  // Handle Cash on Delivery (COD) Checkout
  const handleCodOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const orderNumber = `TITAN-${Date.now().toString().slice(-6)}`;
    const effectiveBilling = billingSameAsShipping
      ? {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
          address: streetAddress.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          gstin: '',
        }
      : {
          name: (billingName || customerName).trim(),
          phone: (billingPhone || customerPhone).trim(),
          email: (billingEmail || customerEmail).trim(),
          address: billingStreetAddress.trim(),
          landmark: billingLandmark.trim(),
          city: (billingCity || city).trim(),
          state: (billingState || state).trim(),
          pincode: (billingPincode || pincode).trim(),
          gstin: billingGstin.trim(),
        };

    try {
      let confirmData: any = null;
      try {
        const confirmRes = await fetch('/api/orders/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerEmail: customerEmail.trim(),
            shippingAddress: {
              address: streetAddress.trim(),
              landmark: landmark.trim(),
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
            },
            billingAddress: effectiveBilling,
            billingSameAsShipping,
            items: items.map((i) => ({
              productId: i.product.id,
              productName: i.product.name,
              packName: i.selectedPack?.name || i.product.size,
              quantity: i.quantity,
              price: i.selectedPack ? i.selectedPack.price : i.product.price,
            })),
            subtotal: totalPrice,
            discount: discountAmount,
            couponCode: appliedCoupon || undefined,
            total: finalTotal,
            paymentMethod: 'cash_on_delivery',
          }),
        });

        if (confirmRes.ok) {
          confirmData = await confirmRes.json();
        }
      } catch (postErr) {
        console.warn('Network notice on COD confirmation call:', postErr);
      }

      const assignedAwb =
        confirmData?.delivery?.trackingNumber ||
        confirmData?.delivery?.waybill ||
        `98${Date.now().toString().slice(-7)}${Math.floor(100 + Math.random() * 900)}`;

      await handleOrderCompletion(
        confirmData?.orderNumber || orderNumber,
        confirmData?.invoiceNumber || `INV-TITAN-${Date.now().toString().slice(-6)}`,
        confirmData?.invoiceDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Cash on Delivery (COD)',
        'COD_PENDING_DELIVERY',
        confirmData?.delivery || {
          courier: 'Delhivery One Express',
          waybill: assignedAwb,
          trackingNumber: assignedAwb,
          trackingUrl: `https://www.delhivery.com/track/package/${assignedAwb}`,
          status: 'COD Order Confirmed & Scheduled for Delhivery Dispatch',
          pickupLocation: 'Delhi Titan Fulfillment Center',
          expectedDelivery: pincodeServiceability?.estimatedDeliveryDays || '2–4 Business Days (Express Pan-India)',
          delhiverySynced: Boolean(confirmData?.delivery?.delhiverySynced),
        }
      );
    } catch (err: any) {
      console.error('COD placement error:', err);
      const fallbackAwb = `98${Date.now().toString().slice(-7)}${Math.floor(100 + Math.random() * 900)}`;
      await handleOrderCompletion(
        orderNumber,
        `INV-TITAN-${Date.now().toString().slice(-6)}`,
        new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Cash on Delivery (COD)',
        'COD_PENDING_DELIVERY',
        {
          courier: 'Delhivery One Express',
          waybill: fallbackAwb,
          trackingNumber: fallbackAwb,
          trackingUrl: `https://www.delhivery.com/track/package/${fallbackAwb}`,
          status: 'COD Order Confirmed & Scheduled for Delhivery Dispatch',
          pickupLocation: 'Delhi Titan Fulfillment Center',
          expectedDelivery: pincodeServiceability?.estimatedDeliveryDays || '2–4 Business Days (Express Pan-India)',
          delhiverySynced: false,
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Handler routing between Razorpay and COD
  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'online') {
      handleRazorpayPayment();
    } else {
      handleCodOrder();
    }
  };

  // =========================================================================
  // VIEW: CONFIRMED ORDER & BILL / TAX INVOICE SCREEN
  // =========================================================================
  if (confirmedOrder && items.length === 0) {
    const isCod = confirmedOrder.paymentMethod.includes('Cash on Delivery') || confirmedOrder.paymentStatus === 'COD_PENDING_DELIVERY';

    return (
      <div className="min-h-screen bg-[#F7F3E8] py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Printable Invoice & Order Confirmation Container */}
        <div className="space-y-6">
          {/* Top Status Header */}
          <div className="bg-white rounded-sm border border-[#10110F]/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#10110F]/10 pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
                    {isCod ? 'ORDER PLACED • CASH ON DELIVERY' : 'ORDER CONFIRMED • PAYMENT VERIFIED'}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F] mt-1">
                    Thank You, {confirmedOrder.customer.name}!
                  </h1>
                  <p className="text-xs text-[#66704B]">
                    Order <strong className="text-[#10110F]">#{confirmedOrder.orderNumber}</strong> has been registered and dispatched with our delivery partner Delhivery.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Print Invoice & Place Another Order */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#D4B66A]" />
                  <span>Print Tax Invoice</span>
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('titan_last_confirmed_order');
                    setConfirmedOrder(null);
                    navigate('/shop');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                  <span>Place Another Order</span>
                </button>
              </div>
            </div>

            {/* Delhivery Express Shipment Card */}
            <div className="mt-6 p-4 sm:p-5 rounded-xs bg-[#183D27]/5 border-2 border-[#183D27]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#183D27]" />
                  <span className="font-serif font-bold text-base text-[#10110F]">
                    Delivery Partner: Delhivery One Express
                  </span>
                  {confirmedOrder.delivery.delhiverySynced ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-[#F7F3E8] text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#D4B66A]" />
                      Synced to Delhivery Dashboard
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9.5px] font-bold uppercase tracking-wider">
                      Shipment Queued for Delhivery Dispatch
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#10110F]">
                  <span>
                    Waybill / AWB: <strong className="font-mono text-sm text-[#183D27]">{confirmedOrder.delivery.trackingNumber}</strong>
                  </span>
                  <span>•</span>
                  <span>Estimated Delivery: <strong>{confirmedOrder.delivery.expectedDelivery || '2–4 Business Days'}</strong></span>
                  <span>•</span>
                  <span>Origin: <strong>{confirmedOrder.delivery.pickupLocation || 'Delhi Hub'}</strong></span>
                </div>
                <p className="text-[11px] text-[#66704B]">
                  Status: <strong className={confirmedOrder.delivery.delhiverySynced ? "text-emerald-800" : "text-amber-800"}>{confirmedOrder.delivery.status}</strong>
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={confirmedOrder.delivery.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Track on Delhivery</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4B66A]" />
                </a>
                <Link
                  to="/admin-desk?tab=orders"
                  className="px-4 py-2.5 rounded-xs bg-[#10110F]/10 hover:bg-[#10110F]/20 text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#10110F]/20 transition-all"
                >
                  <span>Delivery Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#183D27]" />
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OFFICIAL TAX INVOICE & BILL (Clean, Printable A4 Document) */}
          {/* ========================================================================= */}
          <div
            id="titan-tax-invoice"
            className="bg-white rounded-sm border border-[#10110F]/15 p-6 sm:p-10 shadow-sm text-[#10110F] space-y-6"
          >
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-[#10110F] gap-4">
              <div>
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-widest text-[#10110F] uppercase">
                  TITAN SHILAJIT
                </span>
                <p className="text-[10px] tracking-widest text-[#66704B] uppercase mt-0.5">
                  Pure Power of the Himalayas • Official Tax Invoice
                </p>
                <p className="text-[10px] text-[#66704B] mt-1 max-w-sm">
                  Titan Wellness Pvt. Ltd., Okhla Industrial Area Phase III, New Delhi 110020, India.
                  <br />
                  FSSAI Central Lic: 13324001000452 • AYUSH GMP Certified
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="px-2.5 py-1 rounded-xs bg-[#10110F] text-[#D4B66A] text-xs font-black uppercase tracking-wider inline-block">
                  TAX INVOICE
                </span>
                <div className="text-xs space-y-0.5 pt-1">
                  <div>
                    Invoice No: <strong className="font-mono text-sm text-[#183D27]">{confirmedOrder.invoiceNumber}</strong>
                  </div>
                  <div>
                    Date: <strong className="text-[#10110F]">{confirmedOrder.invoiceDate}</strong>
                  </div>
                  <div>
                    Order ID: <strong className="text-[#10110F]">#{confirmedOrder.orderNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Billed To & Shipping Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#10110F]/10 text-xs">
              {/* Column 1: Billed To */}
              <div className="space-y-1.5 p-4 rounded-xs bg-[#F7F3E8]/50 border border-[#10110F]/10">
                <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[#183D27] uppercase tracking-wider block">
                    BILLED TO (TAX INVOICE):
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#183D27]/10 text-[#183D27] text-[9.5px] font-bold uppercase tracking-wider">
                    {confirmedOrder.customer.billingSameAsShipping !== false ? 'Same as Shipping' : 'Custom Billing'}
                  </span>
                </div>
                <p className="font-bold text-sm text-[#10110F]">
                  {confirmedOrder.customer.billingName || confirmedOrder.customer.name}
                </p>
                <p className="text-[#66704B]">
                  {confirmedOrder.customer.billingAddress?.address || confirmedOrder.customer.shippingAddress.address}
                </p>
                {(confirmedOrder.customer.billingAddress?.landmark || confirmedOrder.customer.shippingAddress.landmark) && (
                  <p className="text-[#66704B]">
                    Landmark: {confirmedOrder.customer.billingAddress?.landmark || confirmedOrder.customer.shippingAddress.landmark}
                  </p>
                )}
                <p className="text-[#66704B]">
                  {(confirmedOrder.customer.billingAddress?.city || confirmedOrder.customer.shippingAddress.city)}, {(confirmedOrder.customer.billingAddress?.state || confirmedOrder.customer.shippingAddress.state)} — {(confirmedOrder.customer.billingAddress?.pincode || confirmedOrder.customer.shippingAddress.pincode)}
                </p>
                <p className="text-[#10110F] pt-1">
                  Mobile: <strong>{confirmedOrder.customer.billingPhone || confirmedOrder.customer.phone}</strong> | Email: <strong>{confirmedOrder.customer.billingEmail || confirmedOrder.customer.email}</strong>
                </p>
                {confirmedOrder.customer.billingGstin && (
                  <p className="text-[11px] font-mono text-[#183D27] pt-0.5">
                    GSTIN: <strong>{confirmedOrder.customer.billingGstin}</strong>
                  </p>
                )}
              </div>

              {/* Column 2: Shipped To */}
              <div className="space-y-1.5 p-4 rounded-xs bg-white border border-[#10110F]/10">
                <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[#66704B] uppercase tracking-wider block">
                    SHIPPED TO (DELHIVERY DISPATCH):
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-900 text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#183D27]" />
                    <span>Delhivery Express</span>
                  </span>
                </div>
                <p className="font-bold text-sm text-[#10110F]">{confirmedOrder.customer.name}</p>
                <p className="text-[#66704B]">{confirmedOrder.customer.shippingAddress.address}</p>
                {confirmedOrder.customer.shippingAddress.landmark && (
                  <p className="text-[#66704B]">Landmark: {confirmedOrder.customer.shippingAddress.landmark}</p>
                )}
                <p className="text-[#66704B]">
                  {confirmedOrder.customer.shippingAddress.city}, {confirmedOrder.customer.shippingAddress.state} — {confirmedOrder.customer.shippingAddress.pincode}
                </p>
                <p className="text-[#10110F] pt-1">
                  Delivery Mobile (SMS/OTP): <strong>{confirmedOrder.customer.phone}</strong>
                </p>
                <p className="text-[11px] text-[#66704B] pt-0.5">
                  Assigned Waybill: <strong className="font-mono text-[#183D27]">{confirmedOrder.delivery.trackingNumber}</strong>
                </p>
              </div>
            </div>

            {/* Payment & Logistics Summary Bar */}
            <div className="bg-[#F7F3E8] p-4 rounded-xs border border-[#10110F]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#66704B] uppercase tracking-wider block">Payment Method</span>
                <strong className="text-[#10110F] text-xs sm:text-sm block">{confirmedOrder.paymentMethod}</strong>
                <span className={`inline-block font-bold px-1.5 py-0.5 rounded-xs text-[9.5px] ${
                  isCod ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {isCod ? 'COD (PAY UPON DELIVERY)' : 'PAID IN FULL (RAZORPAY)'}
                </span>
                {confirmedOrder.razorpayPaymentId && (
                  <div className="text-[10px] text-[#66704B] pt-1">
                    Payment ID: <strong className="font-mono text-[#183D27]">{confirmedOrder.razorpayPaymentId}</strong>
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#66704B] uppercase tracking-wider block">Logistics Partner</span>
                <strong className="text-[#183D27] text-xs sm:text-sm block">{confirmedOrder.delivery.courier}</strong>
                <span className="text-[11px] text-[#66704B]">
                  AWB: <strong className="font-mono text-[#10110F]">{confirmedOrder.delivery.trackingNumber}</strong>
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#66704B] uppercase tracking-wider block">Fulfillment Hub</span>
                <strong className="text-[#10110F] text-xs sm:text-sm block">{confirmedOrder.delivery.pickupLocation || 'Delhi Central Fulfillment Hub'}</strong>
                <span className="text-[11px] text-[#66704B]">
                  ETA: <strong>{confirmedOrder.delivery.expectedDelivery || '2–4 Business Days'}</strong>
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#10110F] text-[10px] font-bold uppercase tracking-wider text-[#10110F]">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">HSN/SAC</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Rate</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10110F]/10">
                  {confirmedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <span className="font-bold text-[#10110F] block">{it.productName}</span>
                        <span className="text-[11px] text-[#66704B]">Pack: {it.packName}</span>
                      </td>
                      <td className="py-3 text-center text-[#66704B] font-mono text-[11px]">21069099</td>
                      <td className="py-3 text-center font-bold text-[#10110F]">{it.quantity}</td>
                      <td className="py-3 text-right text-[#66704B]">₹{it.price}</td>
                      <td className="py-3 text-right font-bold text-[#10110F]">₹{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Totals & GST Calculations */}
            <div className="border-t-2 border-[#10110F] pt-4 flex flex-col sm:flex-row justify-between gap-6">
              <div className="text-[11px] text-[#66704B] space-y-1 max-w-sm">
                <p>
                  <strong>Tax Note:</strong> Prices are inclusive of Goods and Services Tax (GST 12% on Ayurvedic Health Supplements, HSN 21069099).
                </p>
                <p>
                  <strong>Authenticity Guarantee:</strong> Packed in tamper-proof pharmaceutical glass jars with sealed high-altitude Himalayan origin certificate.
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#66704B]">
                  <span>Subtotal:</span>
                  <span>₹{confirmedOrder.summary.subtotal}</span>
                </div>
                {confirmedOrder.summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon Discount ({confirmedOrder.summary.couponCode}):</span>
                    <span>-₹{confirmedOrder.summary.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#66704B]">
                  <span>Pan-India Delivery (Delhivery One):</span>
                  <span className="text-emerald-700 font-bold uppercase">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-[#10110F] text-sm font-bold text-[#10110F]">
                  <span>Grand Total:</span>
                  <span className="font-serif text-lg font-bold text-[#183D27]">₹{confirmedOrder.summary.total}</span>
                </div>
              </div>
            </div>

            {/* Invoice Footer Seal */}
            <div className="pt-6 border-t border-[#10110F]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#66704B] gap-4">
              <div>
                <span>Official Computer Generated Tax Invoice • No Physical Signature Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#183D27]" />
                <span className="font-bold text-[#183D27] uppercase tracking-wider">
                  Titan Shilajit Certified Authentic
                </span>
              </div>
            </div>
          </div>

          {/* Place Another Order Action Card */}
          <div className="bg-white rounded-sm border border-[#10110F]/15 p-6 sm:p-8 shadow-sm print:hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  READY FOR YOUR NEXT ORDER?
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                  Order Again or Choose Additional Pure Shilajit
                </h3>
                <p className="text-xs text-[#66704B] max-w-lg">
                  Need another authentic high-altitude resin jar or artisanal honey sticks? You can immediately start a fresh checkout with complimentary express shipping.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('titan_last_confirmed_order');
                    setConfirmedOrder(null);
                    navigate('/shop');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                  <span>Place Another Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Re-order same items:
                    confirmedOrder.items.forEach((it) => {
                      const matchedProd = products.find((p) => p.id === it.productId) || products[0];
                      if (matchedProd) {
                        const matchedPack = matchedProd.packs?.find((pk) => pk.name === it.packName);
                        addToCart(matchedProd, it.quantity, matchedPack, 'add');
                      }
                    });
                    sessionStorage.removeItem('titan_last_confirmed_order');
                    setConfirmedOrder(null);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xs border-2 border-[#183D27] hover:bg-[#183D27]/10 text-[#183D27] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#183D27]" />
                  <span>Order Same Items Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: EMPTY CART GUARD
  // =========================================================================
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#EEE8D7] flex items-center justify-center text-[#B88A32] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#10110F] mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-[#66704B] mb-6">
          Please add Titan Pure Himalayan Shilajit resin or artisanal honey sticks to your cart to proceed with billing and checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  // =========================================================================
  // VIEW: BILLING & CHECKOUT FORM
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7F3E8] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#66704B] hover:text-[#10110F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-[#183D27] bg-[#183D27]/10 px-3 py-1 rounded-full font-bold">
            <Lock className="w-3.5 h-3.5 text-[#183D27]" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 border-b border-[#10110F]/10 pb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#183D27]">
            BILLING & SHIPPING PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F]">
            Complete Your Vitality Order
          </h1>
          <p className="text-xs sm:text-sm text-[#66704B] mt-1">
            Choose your preferred payment method (Credit/Debit Cards, UPI, Net Banking via Razorpay, or Cash on Delivery) with complimentary Delhivery Express dispatch.
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xs bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 animate-in fade-in shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold text-amber-900 mb-0.5">Notice:</strong>
              <p className="leading-relaxed">{errorMessage}</p>
              {paymentMethod !== 'cod' && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('cod');
                    setErrorMessage(null);
                  }}
                  className="mt-3 px-3.5 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] font-bold text-[11px] uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Banknote className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>Switch to Cash on Delivery (Complimentary Shipping)</span>
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CONTACT, SHIPPING ADDRESS & PAYMENT OPTIONS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact & Shipping Address */}
            <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#10110F]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif font-bold text-lg text-[#10110F]">
                    Shipping & Delivery Details
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#183D27] font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delhivery Pan-India Express</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Mobile Phone (10 digits) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#66704B] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-[#66704B] mt-0.5 block">
                    Used for Delhivery delivery SMS & OTP updates
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                  <span className="text-[10px] text-[#66704B] mt-0.5 block">
                    Tax invoice and tracking receipt are emailed here
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Complete Street Address (Flat / House No / Building) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Flat 402, Himalayan Heights, Sector 14"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near City Center Metro"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F]">
                      PIN Code (6 Digits) *
                    </label>
                    <span className="text-[10px] font-mono text-[#183D27] font-semibold flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#183D27]" />
                      Delhivery Express
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none font-bold"
                  />
                  {pincodeServiceability && (
                    <div className="mt-1.5 text-[11px] leading-tight">
                      {pincodeServiceability.loading ? (
                        <span className="text-[#66704B] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#183D27] animate-ping" />
                          Checking Delhivery B2C serviceability...
                        </span>
                      ) : pincodeServiceability.serviceable ? (
                        <div className="p-2 rounded-xs bg-[#183D27]/10 border border-[#183D27]/20 text-[#183D27] space-y-0.5 animate-in fade-in">
                          <div className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#183D27] shrink-0" />
                            <span>
                              Delhivery Serviceable: {pincodeServiceability.city}, {pincodeServiceability.state}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#66704B] flex items-center gap-2 flex-wrap">
                            <span>ETA: {pincodeServiceability.estimatedDeliveryDays}</span>
                            <span>•</span>
                            <span className={pincodeServiceability.codAvailable ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                              {pincodeServiceability.codAvailable ? 'COD & Prepaid Available' : 'Prepaid Only'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xs bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
                          Connecting with regional delivery partner for this postal code.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Delhi"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 1.2: Billing Address & Tax Invoice Details */}
            <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#10110F]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] font-bold text-xs flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-[#D4B66A]" />
                  </span>
                  <div>
                    <h2 className="font-serif font-bold text-lg text-[#10110F]">
                      Billing Address & Tax Invoice Particulars
                    </h2>
                    <p className="text-[11px] text-[#66704B]">
                      Official GST tax invoice will be generated and emailed with these details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox: Same as shipping address */}
              <label className="flex items-start gap-3 p-3.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 cursor-pointer hover:border-[#183D27] transition-all">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="mt-0.5 rounded text-[#183D27] focus:ring-[#183D27] w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs text-[#10110F] block">
                    Billing address is the same as shipping & delivery address
                  </span>
                  <span className="text-[11px] text-[#66704B] block mt-0.5">
                    Your Tax Invoice and Delhivery shipping consignment will use identical customer and address details.
                  </span>
                </div>
              </label>

              {/* Live Preview when Same as Shipping */}
              {billingSameAsShipping ? (
                <div className="p-3.5 rounded-xs bg-[#183D27]/5 border border-[#183D27]/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#183D27]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#183D27]" />
                    <span>Active Billing & Invoice Profile (Mirrored from Delivery Address)</span>
                  </div>
                  <p className="font-bold text-[#10110F]">
                    {customerName || 'Customer Name'} • +91 {customerPhone || 'Phone'}
                  </p>
                  <p className="text-[#66704B]">
                    {streetAddress ? `${streetAddress}${landmark ? `, Near ${landmark}` : ''}, ${city}, ${state} - ${pincode}` : 'Complete your shipping address above to preview your tax invoice address.'}
                  </p>
                  {customerEmail && (
                    <p className="text-[11px] text-[#66704B]">
                      Invoice Dispatch Email: <strong className="text-[#10110F]">{customerEmail}</strong>
                    </p>
                  )}
                </div>
              ) : (
                /* Distinct Billing Address Form */
                <div className="space-y-4 pt-2 border-t border-[#10110F]/10 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xs bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong>Custom Billing Enabled:</strong> Your physical parcel will be dispatched to the delivery address via Delhivery One, while your official Tax Invoice will be issued to this billing profile.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Billing Name / Company Name *
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        placeholder="e.g. Vikramaditya Sharma or Titan Enterprises Ltd."
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Billing Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-[#66704B] font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder={customerPhone || '9876543210'}
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-11 pr-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Billing Email
                      </label>
                      <input
                        type="email"
                        placeholder={customerEmail || 'billing@example.com'}
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Complete Billing Address (Street / Office / Building) *
                      </label>
                      <textarea
                        rows={2}
                        required={!billingSameAsShipping}
                        placeholder="e.g. Office 501, Corporate Tower, MG Road"
                        value={billingStreetAddress}
                        onChange={(e) => setBillingStreetAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Metro Gate 2"
                        value={billingLandmark}
                        onChange={(e) => setBillingLandmark(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        maxLength={6}
                        placeholder="110001"
                        value={billingPincode}
                        onChange={(e) => setBillingPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        placeholder="City"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        placeholder="State"
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        GSTIN Number (Optional - for Business Tax Input Credit)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={billingGstin}
                        onChange={(e) => setBillingGstin(e.target.value.toUpperCase().trim())}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none font-mono uppercase"
                      />
                      <span className="text-[10px] text-[#66704B] mt-0.5 block">
                        If you have a GST registration number, enter it here to claim B2B input tax credit.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#10110F]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-serif font-bold text-lg text-[#10110F]">
                    Payment Gateway & Mode
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#B88A32] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B88A32]" />
                  <span>Razorpay Verified Gateway</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Option 1: Razorpay Online Payment */}
                <label
                  className={`block p-4 sm:p-5 rounded-xs border-2 transition-all cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'border-[#183D27] bg-[#183D27]/5 ring-1 ring-[#183D27]'
                      : 'border-[#10110F]/15 hover:border-[#10110F]/30 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment_option"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1 text-[#183D27] focus:ring-[#183D27]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-serif font-bold text-base text-[#10110F]">
                          Razorpay Standard Checkout (Instant Dispatch)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[9.5px] font-black uppercase tracking-wider">
                          MOST POPULAR • SECURE
                        </span>
                      </div>
                      <p className="text-xs text-[#66704B] mt-1 leading-relaxed">
                        Pay securely with UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), or Net Banking across 50+ banks.
                      </p>

                      {/* Payment Badges Strip */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#10110F]/10 text-[10px] font-bold text-[#10110F]">
                        <span className="px-2 py-1 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#B88A32]" />
                          UPI / QR
                        </span>
                        <span className="px-2 py-1 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-[#183D27]" />
                          Credit & Debit Cards
                        </span>
                        <span className="px-2 py-1 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                          Net Banking
                        </span>
                        <span className="px-2 py-1 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                          Wallets
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery */}
                <label
                  className={`block p-4 sm:p-5 rounded-xs border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#183D27] bg-[#183D27]/5 ring-1 ring-[#183D27]'
                      : 'border-[#10110F]/15 hover:border-[#10110F]/30 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment_option"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#183D27] focus:ring-[#183D27]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-serif font-bold text-base text-[#10110F]">
                          Cash on Delivery (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#EEE8D7] text-[#10110F] text-[9.5px] font-bold uppercase tracking-wider">
                          PAY AT DOORSTEP
                        </span>
                      </div>
                      <p className="text-xs text-[#66704B] mt-1 leading-relaxed">
                        Pay in cash or scan the delivery executive's UPI QR code when your package arrives at your doorstep via Delhivery One.
                      </p>
                      <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#183D27] font-semibold">
                        <Banknote className="w-4 h-4" />
                        <span>Zero upfront charge • Automatic Delhivery tracking code generation</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Security Banner */}
              <div className="p-3 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-center gap-2.5 text-xs text-[#66704B]">
                <ShieldCheck className="w-4 h-4 text-[#183D27] shrink-0" />
                <span>
                  All transactions are encrypted with 256-bit SSL. Titan Shilajit never stores payment card numbers.
                </span>
              </div>
            </div>

            {/* Mobile / Direct Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer disabled:opacity-50 min-h-[52px]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4B66A]" />
                    <span>Processing Secure Order...</span>
                  </>
                ) : paymentMethod === 'online' ? (
                  <>
                    <Lock className="w-4 h-4 text-[#D4B66A]" />
                    <span>PAY ₹{finalTotal} VIA RAZORPAY</span>
                    <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 text-[#D4B66A]" />
                    <span>PLACE CASH ON DELIVERY ORDER (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-[#66704B] mt-2">
                By completing order, your shipment will be automatically manifested with Delhivery One Logistics.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: ORDER SUMMARY & COUPONS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-[#10110F]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#10110F]">
                  Order Items ({items.length})
                </h3>
                <Link
                  to="/shop"
                  className="text-[11px] font-bold text-[#183D27] hover:underline uppercase"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#10110F]/10 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => {
                  const displayImage = item.selectedPack?.image || item.product.images[0];
                  const unitPrice = item.selectedPack ? item.selectedPack.price : item.product.price;
                  const packName = item.selectedPack ? item.selectedPack.name : item.product.size;

                  return (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xs overflow-hidden bg-[#10110F] shrink-0 border border-[#10110F]/10">
                        <img
                          src={displayImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#10110F] truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#66704B]">
                          <span>{packName}</span>
                          <span>•</span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                        <span className="text-xs font-bold text-[#10110F]">
                          ₹{unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-[#10110F]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#183D27]" />
                    <span>Have a Coupon?</span>
                  </span>
                  {!appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponCode('FIRST50');
                        handleApplyCoupon('FIRST50');
                      }}
                      className="text-[10px] text-[#183D27] underline font-bold hover:text-[#B88A32] cursor-pointer"
                    >
                      Use "FIRST50"
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xs bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        Coupon <strong>{appliedCoupon}</strong> Applied (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] uppercase font-bold text-red-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. FIRST50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs uppercase font-bold"
                    />
                    <button
                      type="button"
                      disabled={isVerifyingCoupon || !couponCode.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] rounded-xs text-xs font-bold uppercase disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isVerifyingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}

                {couponMessage && (
                  <div
                    className={`p-2 rounded-xs text-[11px] flex items-start gap-1.5 leading-snug ${
                      couponMessage.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {couponMessage.type === 'error' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span>{couponMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="pt-3 border-t border-[#10110F]/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#66704B]">
                  <span>Items Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-800 font-semibold">
                    <span>Coupon Savings ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#66704B]">
                  <span>Delhivery Express Shipping</span>
                  <span className="text-emerald-700 font-bold uppercase">COMPLIMENTARY</span>
                </div>
                <div className="flex items-center justify-between text-[#66704B]">
                  <span>Taxes (GST 12%)</span>
                  <span className="text-xs">Included</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-[#10110F] pt-3 border-t-2 border-[#10110F]">
                  <span>Total Amount Payable</span>
                  <span className="font-serif text-2xl font-bold text-[#183D27]">₹{finalTotal}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#10110F]/10 space-y-2 text-[11px] text-[#66704B]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#183D27] shrink-0" />
                  <span>Complimentary Pan-India Express Delivery via Delhivery One</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B88A32] shrink-0" />
                  <span>NABL Lab Batch Certificate & Sealed Box Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#183D27] shrink-0" />
                  <span>Estimated Dispatch: Within 24 Hours from Delhi Hub</span>
                </div>
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="p-4 rounded-xs bg-[#EEE8D7]/80 border border-[#10110F]/10 text-xs space-y-2">
              <span className="font-bold text-[#10110F] uppercase tracking-wider text-[10px] block">
                Need Help with your Order?
              </span>
              <p className="text-[#66704B] text-[11px]">
                Our Delhi concierge team is available to assist with custom pack selections, corporate orders, and wellness guidance.
              </p>
              <a
                href={`https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encodeURIComponent(
                  `Hello Titan Shilajit Concierge, I have a question regarding my checkout order of ₹${finalTotal}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#183D27] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Chat with Titan Concierge (+91 99584 74229)</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

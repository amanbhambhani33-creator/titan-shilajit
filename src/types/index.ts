export type PackType = 'trial' | 'popular' | 'supersaver';

export interface ProductPack {
  id: PackType;
  name: string;
  label: string;
  quantityText: string;
  price: number;
  mrp: number;
  discount: string;
  image: string;
  badge?: string;
  savings?: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'resin' | 'honey-sticks' | 'bundles';
  tagline: string;
  price: number;
  mrp?: number;
  discount?: string;
  size: string;
  servings: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQty?: number;
  images: string[];
  packs?: ProductPack[];
  shortDescription: string;
  description: string;
  origin: string;
  elevation: string;
  fulvicAcidContent: string;
  ingredients: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  usage: {
    step: string;
    instruction: string;
  }[];
  qualityNotes: string[];
  safetyNotes: string;
}

export interface ProductGuidance {
  productName: string;
  recommendedServing: string;
  maximumDailyServing: string;
  recommendedTiming: string;
  minimumSuggestedRoutine: string;
  safetyNotes: string;
}

export interface Review {
  id: string;
  productId?: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  productName: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface BenefitCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  tag?: string;
}

export interface QualityTrustCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  tag?: string;
  badge?: string;
}

export interface QualityTrustConfig {
  kicker: string;
  title: string;
  description: string;
  cards: QualityTrustCard[];
}

export interface HeroSlideImage {
  id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  altText?: string;
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedPack?: ProductPack;
}

export interface AssessmentFormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  lifestyle: 'Sedentary' | 'Moderately Active' | 'Very Active' | 'Athlete / Gym';
  wellnessGoals: string[];
  sleepDuration: string;
  exerciseFrequency: string;
  workType: string;
  caffeineConsumption: string;
  waterIntake: string;
  // Safety screening questions
  isPregnantOrBreastfeeding: boolean;
  isUnderMedicalTreatment: boolean;
  takesPrescriptionMedication: boolean;
  hasDiagnosedMedicalCondition: boolean;
  hasIngredientAllergies: boolean;
  consentAgreed: boolean;
}

export interface AssessmentResultData {
  primaryGoal: string;
  lifestyleSummary: string;
  suggestedProduct: string;
  productSlug: string;
  whyThisFits: string;
  suggestedRoutine: {
    time: string;
    action: string;
    details: string;
  }[];
  approvedServing: string;
  approvedTiming: string;
  consistencyDuration: string;
  whatYouMayNotice: string;
  safetyAdvisory: string;
  isSafetyRestricted: boolean;
}

export type AdminRole = 'super_admin' | 'store_manager' | 'content_editor' | 'inventory_associate' | 'viewer';

export interface AdminPermissions {
  canEditProducts: boolean;
  canEditBanners: boolean;
  canEditContent: boolean;
  canManageUsers: boolean;
  canSyncCloud: boolean;
  canExportData: boolean;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isPermanent: boolean;
  status: 'active' | 'pending' | 'revoked';
  assignedPassword?: string;
  permissions: AdminPermissions;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  lastLogin?: string;
}

export interface AccessRequestRecord {
  id: string;
  email: string;
  name: string;
  requestedRole: AdminRole;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedPassword?: string;
  assignedRole?: AdminRole;
  permissions?: AdminPermissions;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ShippingAddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface BillingAddressData {
  name?: string;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  gstin?: string;
}

export interface DeliveryDetails {
  courier: string;
  trackingNumber: string;
  trackingUrl: string;
  status: string;
  pickupLocation?: string;
  expectedDelivery?: string;
  delhiverySynced?: boolean;
  delhiveryError?: string;
  manifestId?: string;
  rawResponse?: any;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress?: string;
  shippingAddressDetails?: ShippingAddressData;
  billingAddress?: string;
  billingAddressDetails?: BillingAddressData;
  billingSameAsShipping?: boolean;
  billingName?: string;
  billingPhone?: string;
  billingEmail?: string;
  billingGstin?: string;
  deliveryDetails?: DeliveryDetails;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentStatus?: 'PAID' | 'COD_PENDING_DELIVERY' | 'PENDING' | 'FAILED';
  razorpayDetails?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  items: {
    productId: string;
    productName: string;
    packName?: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod: 'whatsapp_prepaid' | 'cash_on_delivery' | 'online';
  createdAt: string;
  updatedAt?: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}



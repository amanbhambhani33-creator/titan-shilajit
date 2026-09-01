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
  images: string[];
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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
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

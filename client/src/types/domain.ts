/**
 * Shared frontend domain models used by API modules, context, and pages.
 */
export interface FamilyMember {
  _id?: string;
  age: number;
  avatar?: string;
  diet: string;
  memberId?: string;
  name: string;
  relation: string;
}

export interface UserPreferences {
  glutenFree: boolean;
  nonVeg: boolean;
  vegan: boolean;
  vegetarian: boolean;
}

export interface User {
  _id: string;
  age?: number;
  avatar?: string;
  createdAt: string;
  familyMembers: FamilyMember[];
  familySize: number;
  monthlyBudget: number;
  name: string;
  preferences: UserPreferences;
  username: string;
}

export interface Product {
  _id: string;
  category: string;
  expiryDays: number;
  imageEmoji?: string;
  isActive?: boolean;
  name: string;
  price: number;
  tags?: string[];
  unit: string;
}

export interface CartItem {
  _id: string;
  addedAt?: string;
  addedBy?: string;
  category: string;
  expiryDays?: number;
  forWhom?: string;
  imageEmoji?: string;
  name: string;
  price: number;
  product?: string;
  quantity: number;
  requestedBy?: string;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  user: string;
}

export interface Purchase {
  _id: string;
  createdAt: string;
  items: CartItem[];
  month: string;
  totalAmount: number;
  user: string;
}

export interface MonthlyStat {
  _id: string;
  count: number;
  total: number;
}

export interface CategoryStat {
  _id: string;
  total: number;
}

export interface SuggestionItem {
  avgFreq?: number;
  budgetWarning?: boolean;
  category: string;
  daysSinceLast?: number;
  imageEmoji?: string;
  name: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedQty: number;
}

export interface ExpiryAlert {
  category: string;
  daysLeft: number;
  expiryDate: string;
  imageEmoji?: string;
  name: string;
}

export interface SuggestionsResponse {
  monthlySpend: number;
  remainingBudget: number;
  suggestions: SuggestionItem[];
}

export interface PurchaseStatsResponse {
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
}

export interface CartSummaryResponse {
  budgetWarning: boolean;
  cart: Cart;
  itemCount: number;
  monthlyBudget: number;
  total: number;
}

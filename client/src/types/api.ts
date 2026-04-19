import {
  CartSummaryResponse,
  ExpiryAlert,
  FamilyMember,
  Product,
  Purchase,
  PurchaseStatsResponse,
  SuggestionsResponse,
  User,
} from './domain';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface ProductsResponse {
  products: Product[];
}

export interface SeedProductsResponse {
  count: number;
  message: string;
}

export interface CartResponse {
  cart: CartSummaryResponse['cart'];
}

export interface PurchasesResponse {
  purchases: Purchase[];
}

export interface ExpiryAlertsResponse {
  alerts: ExpiryAlert[];
}

export interface FamilyMembersResponse {
  familyMembers: FamilyMember[];
}

export interface MessageResponse {
  message: string;
}

export interface RegisterPayload {
  age?: number | string;
  avatar?: string;
  familyMembers?: FamilyMember[];
  familySize?: number;
  monthlyBudget?: number;
  name: string;
  password: string;
  preferences?: Partial<User['preferences']>;
  username: string;
}

export interface LoginPayload {
  password: string;
  username: string;
}

export interface UpdateProfilePayload {
  age?: number | string;
  avatar?: string;
  currentPassword?: string;
  familySize?: number;
  monthlyBudget?: number;
  name?: string;
  password?: string;
  preferences?: User['preferences'];
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
}

export interface AddToCartPayload {
  addedBy?: string;
  category: string;
  expiryDays?: number;
  forWhom?: string;
  imageEmoji?: string;
  name: string;
  price: number;
  productId?: string;
  quantity?: number;
  requestedBy?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface PurchaseQueryParams {
  limit?: number;
  month?: string;
}

export type SuggestionsApiResponse = SuggestionsResponse;
export type PurchaseStatsApiResponse = PurchaseStatsResponse;

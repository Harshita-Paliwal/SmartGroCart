import { AddToCartPayload, CartResponse, MessageResponse, UpdateCartItemPayload } from '../../types/api';
import { CartSummaryResponse } from '../../types/domain';
import api from '../axios';

/**
 * Loads the current cart summary used by the cart screen and sidebar badge.
 */
export const getCart = () => api.get<CartSummaryResponse>('/cart');

/**
 * Adds a product or custom request into the current cart.
 */
export const addToCart = (payload: AddToCartPayload) => api.post<CartResponse>('/cart/add', payload);

/**
 * Updates the quantity for a single cart item.
 */
export const updateCartItem = (itemId: string, payload: UpdateCartItemPayload) =>
  api.put<CartResponse>(`/cart/item/${itemId}`, payload);

/**
 * Removes one item from the current cart.
 */
export const removeCartItem = (itemId: string) => api.delete<CartResponse>(`/cart/item/${itemId}`);

/**
 * Clears all current cart items.
 */
export const clearCart = () => api.delete<MessageResponse>('/cart/clear');

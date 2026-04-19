import { CartItem } from '../types/domain';

/**
 * Counts the total units in the cart so the UI can show a badge count.
 */
export const getCartItemCount = (items: CartItem[] = []) =>
  items.reduce((totalQuantity, cartItem) => totalQuantity + cartItem.quantity, 0);

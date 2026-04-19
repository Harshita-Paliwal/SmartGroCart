const Cart = require('../models/Cart');
const User = require('../models/User');

/**
 * Creates an empty cart for a user when one does not exist yet.
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

/**
 * Counts the total number of units across all cart line items.
 */
const getCartItemCount = (cart) =>
  cart.items.reduce((totalQuantity, cartItem) => totalQuantity + cartItem.quantity, 0);

/**
 * Calculates the current checkout total for a cart snapshot.
 */
const calculateCartTotal = (cart) =>
  cart.items.reduce((totalAmount, cartItem) => totalAmount + cartItem.price * cartItem.quantity, 0);

/**
 * Builds the payload returned to the frontend cart screen.
 */
const buildCartSummary = async (userId) => {
  const [cart, user] = await Promise.all([getOrCreateCart(userId), User.findById(userId)]);
  const totalAmount = calculateCartTotal(cart);
  const monthlyBudget = user?.monthlyBudget || 5000;

  return {
    cart,
    total: totalAmount,
    monthlyBudget,
    itemCount: getCartItemCount(cart),
    budgetWarning: totalAmount > monthlyBudget * 0.8,
  };
};

module.exports = {
  buildCartSummary,
  calculateCartTotal,
  getCartItemCount,
  getOrCreateCart,
};

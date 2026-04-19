const Purchase = require('../models/Purchase');
const { calculateCartTotal } = require('./cartService');

/**
 * Converts the current cart snapshot into a persisted purchase record.
 */
const createPurchaseFromCart = async (userId, cart) => {
  const totalAmount = calculateCartTotal(cart);

  return Purchase.create({
    user: userId,
    items: cart.items,
    totalAmount,
  });
};

module.exports = { createPurchaseFromCart };

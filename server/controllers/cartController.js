const User = require('../models/User');
const { buildCartSummary, getOrCreateCart } = require('../services/cartService');

/**
 * Returns the current cart alongside budget metadata used by the frontend.
 */
const getCart = async (request, response) => {
  const cartSummary = await buildCartSummary(request.userId);
  return response.json(cartSummary);
};

/**
 * Adds a product or custom family request to the active cart.
 */
const addCartItem = async (request, response) => {
  const cart = await getOrCreateCart(request.userId);
  const user = await User.findById(request.userId);
  const {
    addedBy,
    category,
    expiryDays,
    forWhom,
    imageEmoji,
    name,
    price,
    productId,
    quantity,
    requestedBy,
  } = request.body;

  const effectiveRequestedBy = requestedBy || user?.name || 'Family';
  const effectiveAddedBy = addedBy || user?.name || 'Family';
  const effectiveForWhom = forWhom || 'Family';

  const existingItem = productId
    ? cart.items.find(
        (cartItem) =>
          cartItem.product?.toString() === productId &&
          (cartItem.requestedBy || 'Family') === effectiveRequestedBy &&
          (cartItem.forWhom || 'Family') === effectiveForWhom,
      )
    : null;

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({
      addedBy: effectiveAddedBy,
      category,
      expiryDays,
      forWhom: effectiveForWhom,
      imageEmoji,
      name,
      price,
      product: productId,
      quantity: quantity || 1,
      requestedBy: effectiveRequestedBy,
    });
  }

  await cart.save();
  return response.json({ cart });
};

/**
 * Updates the quantity for a specific cart line item.
 */
const updateCartItemQuantity = async (request, response) => {
  const cart = await getOrCreateCart(request.userId);
  const cartItem = cart.items.id(request.params.itemId);

  if (!cartItem) {
    return response.status(404).json({ message: 'Item not found' });
  }

  cartItem.quantity = request.body.quantity;

  if (cartItem.quantity <= 0) {
    cart.items.pull(request.params.itemId);
  }

  await cart.save();
  return response.json({ cart });
};

/**
 * Removes one line item from the user's cart.
 */
const removeCartItem = async (request, response) => {
  const cart = await getOrCreateCart(request.userId);
  cart.items.pull(request.params.itemId);
  await cart.save();

  return response.json({ cart });
};

/**
 * Clears every line item from the current cart.
 */
const clearCart = async (request, response) => {
  const cart = await getOrCreateCart(request.userId);
  cart.items = [];
  await cart.save();

  return response.json({ message: 'Cart cleared' });
};

module.exports = {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
};

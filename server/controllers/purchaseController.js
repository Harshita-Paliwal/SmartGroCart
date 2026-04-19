const Purchase = require('../models/Purchase');
const { getOrCreateCart } = require('../services/cartService');
const { createPurchaseFromCart } = require('../services/purchaseService');

/**
 * Converts the current cart into a purchase and empties the cart afterwards.
 */
const checkout = async (request, response) => {
  const cart = await getOrCreateCart(request.userId);

  if (!cart.items.length) {
    return response.status(400).json({ message: 'Cart is empty' });
  }

  const purchase = await createPurchaseFromCart(request.userId, cart);
  cart.items = [];
  await cart.save();

  return response.status(201).json({ message: 'Checkout successful!', purchase });
};

/**
 * Returns purchase history, optionally filtered by month and result size.
 */
const listPurchases = async (request, response) => {
  const { limit = 30, month } = request.query;
  const purchaseFilter = { user: request.userId };

  if (month) {
    purchaseFilter.month = month;
  }

  const purchases = await Purchase.find(purchaseFilter)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return response.json({ purchases });
};

/**
 * Aggregates recent spending data for the dashboard and history charts.
 */
const getPurchaseStats = async (request, response) => {
  const [monthlyStats, categoryStats] = await Promise.all([
    Purchase.aggregate([
      { $match: { user: request.userId } },
      { $group: { _id: '$month', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]),
    Purchase.aggregate([
      { $match: { user: request.userId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { total: -1 } },
    ]),
  ]);

  return response.json({
    categoryStats,
    monthlyStats: monthlyStats.reverse(),
  });
};

module.exports = {
  checkout,
  getPurchaseStats,
  listPurchases,
};

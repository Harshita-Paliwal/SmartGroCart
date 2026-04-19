const Purchase = require('../models/Purchase');
const User = require('../models/User');
const { generateSuggestions, getExpiryAlerts } = require('../utils/suggestionEngine');

/**
 * Loads the data needed to generate rule-based shopping suggestions.
 */
const getRuleBasedSuggestions = async (userId) => {
  const [purchases, user] = await Promise.all([
    Purchase.find({ user: userId }).sort({ createdAt: -1 }).limit(50),
    User.findById(userId),
  ]);

  return generateSuggestions(purchases, user);
};

/**
 * Loads recent purchases and derives near-term expiry reminders.
 */
const getUpcomingExpiryAlerts = async (userId) => {
  const purchases = await Purchase.find({ user: userId }).sort({ createdAt: -1 }).limit(15);
  return getExpiryAlerts(purchases);
};

/**
 * Builds the compact history summary passed to the optional AI endpoint.
 */
const buildPurchaseSummary = (purchases) => {
  const summaryByItemName = {};

  purchases.forEach((purchase) => {
    purchase.items.forEach((item) => {
      if (!summaryByItemName[item.name]) {
        summaryByItemName[item.name] = {
          category: item.category,
          count: 0,
          lastDate: null,
        };
      }

      summaryByItemName[item.name].count += 1;

      if (
        !summaryByItemName[item.name].lastDate ||
        new Date(purchase.createdAt) > new Date(summaryByItemName[item.name].lastDate)
      ) {
        summaryByItemName[item.name].lastDate = purchase.createdAt;
      }
    });
  });

  return summaryByItemName;
};

module.exports = {
  buildPurchaseSummary,
  getRuleBasedSuggestions,
  getUpcomingExpiryAlerts,
};

/**
 * SMART SUGGESTION ENGINE
 * -----------------------
 * Rule-based logic that analyses purchase history to suggest what
 * the user should buy next. No ML — pure rules, explainable to interviewers.
 *
 * Rules applied:
 *  1. FREQUENCY  — if daysSinceLast >= avgFrequency  → priority: high
 *  2. DUE SOON   — if daysSinceLast >= avgFreq * 0.8 → priority: medium
 *  3. FAMILY SIZE — suggestedQty = max(avgQty, ceil(familySize/2))
 *  4. BUDGET     — flag expensive items if <30% budget remaining
 */

const daysBetween = (d1, d2) => Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

/**
 * @param {Array}  purchases  - recent Purchase documents (sorted desc)
 * @param {Object} user       - User document
 * @returns {{ suggestions, remainingBudget, monthlySpend }}
 */
const generateSuggestions = (purchases, user) => {
  const now = new Date();
  const map = {};

  // Build frequency map
  for (const purchase of purchases) {
    for (const item of purchase.items) {
      const key = item.name;
      if (!map[key]) map[key] = { name: item.name, category: item.category, price: item.price, imageEmoji: item.imageEmoji || '🛒', dates: [], quantities: [] };
      map[key].dates.push(new Date(purchase.createdAt));
      map[key].quantities.push(item.quantity);
    }
  }

  const suggestions = [];

  for (const data of Object.values(map)) {
    const sorted       = [...data.dates].sort((a, b) => a - b);
    const lastBought   = sorted[sorted.length - 1];
    const daysSinceLast = daysBetween(lastBought, now);

    // Average days between purchases
    let avgFreq = 14;
    if (sorted.length >= 2) {
      const gaps = [];
      for (let i = 1; i < sorted.length; i++) gaps.push(daysBetween(sorted[i - 1], sorted[i]));
      avgFreq = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }

    const avgQty        = Math.round(data.quantities.reduce((a, b) => a + b, 0) / data.quantities.length);
    const familyBoost   = Math.ceil((user.familySize || 1) / 2);
    const suggestedQty  = Math.max(avgQty, familyBoost);

    if (daysSinceLast >= avgFreq) {
      suggestions.push({ ...data, suggestedQty, priority: 'high',   reason: `You buy this every ~${avgFreq} days — it's been ${daysSinceLast} days`, daysSinceLast, avgFreq });
    } else if (daysSinceLast >= avgFreq * 0.8) {
      suggestions.push({ ...data, suggestedQty, priority: 'medium', reason: `Usually every ${avgFreq} days — ${daysSinceLast} days since last purchase`, daysSinceLast, avgFreq });
    }
  }

  // Calculate monthly spend
  const monthStart    = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlySpend  = purchases.filter(p => new Date(p.createdAt) >= monthStart).reduce((s, p) => s + p.totalAmount, 0);
  const remainingBudget = (user.monthlyBudget || 5000) - monthlySpend;

  // Budget flag
  if (remainingBudget < (user.monthlyBudget || 5000) * 0.3) {
    suggestions.forEach(s => { if (s.price > 150) s.budgetWarning = true; });
  }

  suggestions.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]));
  return { suggestions: suggestions.slice(0, 12), remainingBudget, monthlySpend };
};

/**
 * @param {Array} purchases - recent Purchase documents
 * @returns {Array} items expiring within 3 days
 */
const getExpiryAlerts = (purchases) => {
  const now    = new Date();
  const alerts = [];

  for (const purchase of purchases.slice(0, 15)) {
    for (const item of purchase.items) {
      if (!item.expiryDays) continue;
      const expiryDate = new Date(new Date(purchase.createdAt).getTime() + item.expiryDays * 86400000);
      const daysLeft   = Math.ceil((expiryDate - now) / 86400000);
      if (daysLeft <= 3 && daysLeft >= 0) {
        alerts.push({ name: item.name, category: item.category, imageEmoji: item.imageEmoji || '🛒', daysLeft, expiryDate: expiryDate.toDateString() });
      }
    }
  }
  return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
};

module.exports = { generateSuggestions, getExpiryAlerts };

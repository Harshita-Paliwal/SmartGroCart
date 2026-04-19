/**
 * PURCHASE SCHEMA
 * ---------------
 * Created when user checks out their cart.
 * Items are embedded (denormalised) — preserves historical prices.
 * The "month" field (e.g. "2025-06") is pre-computed for fast
 * MongoDB aggregation queries used in spending charts.
 *
 * MongoDB Collection: purchases
 *
 * Fields:
 *   user        – ref to User._id
 *   items[]     – snapshot of cart items at checkout time
 *   totalAmount – sum of price*quantity for all items
 *   month       – "YYYY-MM" string, auto-set in pre-save hook
 *
 * Used by:
 *   - Purchase history page (list view)
 *   - Spending charts (aggregate by month / category)
 *   - Suggestion engine (analyse frequency per product)
 *   - Expiry alert system (calculate expiry date from purchase date)
 */
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:       String,
    category:   String,
    price:      Number,
    quantity:   Number,
    expiryDays: Number,
    imageEmoji: String,
    requestedBy: String,
    addedBy:    String,
    forWhom:    String,
  }],
  totalAmount: { type: Number, required: true },
  month:       { type: String, index: true },
}, { timestamps: true });

// Auto-compute "YYYY-MM" before saving
purchaseSchema.pre('save', function (next) {
  const d    = this.createdAt || new Date();
  this.month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);

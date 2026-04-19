/**
 * CART SCHEMA
 * -----------
 * One cart document per user (unique: true on user field).
 * Items are embedded (denormalised) — price/name stored at add-time
 * so price changes don't affect the cart snapshot.
 *
 * MongoDB Collection: carts
 *
 * Cart item fields:
 *   product    – ref to Product._id (optional, can add custom items)
 *   name       – copied from Product at add-time
 *   category   – copied from Product
 *   price      – copied from Product (snapshot)
 *   quantity   – how many units
 *   expiryDays – copied from Product (for expiry tracking after checkout)
 *   imageEmoji – copied from Product
 */
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:       { type: String, required: true },
  category:   String,
  price:      { type: Number, required: true },
  quantity:   { type: Number, default: 1, min: 1 },
  expiryDays: Number,
  imageEmoji: String,
  requestedBy: String,
  addedBy:    String,
  forWhom:    String,
  addedAt:    { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

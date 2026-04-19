/**
 * PRODUCT SCHEMA
 * --------------
 * Catalog of grocery items. Seeded via POST /api/products/seed.
 *
 * MongoDB Collection: products
 *
 * Fields:
 *   name       – product name
 *   category   – one of the allowed grocery categories
 *   price      – price in INR (₹)
 *   unit       – e.g. "kg", "litre", "piece"
 *   expiryDays – how many days after purchase before it expires
 *                (used by expiry alert system)
 *   imageEmoji – emoji shown in UI
 *   tags       – e.g. ["daily","protein"] for suggestion filtering
 *   isActive   – soft delete flag
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  category:   {
    type: String, required: true,
    enum: ['Dairy','Vegetables','Fruits','Meat','Grains','Beverages','Snacks','Household','Personal Care','Other'],
  },
  price:      { type: Number, required: true, min: 0 },
  unit:       { type: String, default: 'piece' },
  expiryDays: { type: Number, default: 7 },
  imageEmoji: { type: String, default: '🛒' },
  tags:       [String],
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

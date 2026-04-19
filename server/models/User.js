/**
 * USER SCHEMA
 * -----------
 * Stores login credentials (username + bcrypt password - NO email, NO OTP),
 * budget settings, dietary preferences, and embedded family members.
 *
 * MongoDB Collection: users
 *
 * Fields:
 *   name          - display name
 *   age           - owner age for profile personalization
 *   username      - unique login handle (lowercase)
 *   password      - bcrypt hashed (min 6 chars)
 *   familySize    - used by suggestion engine for quantity scaling
 *   monthlyBudget - budget tracker reference value
 *   preferences   - dietary flags (vegetarian / vegan / glutenFree / nonVeg)
 *   familyMembers - embedded array (name, age, relation, diet)
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const makeCode = (prefix, len = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = prefix;
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const familyMemberSchema = new mongoose.Schema({
  memberId: { type: String, default: () => makeCode('FM-', 6) },
  name:     { type: String, required: true, trim: true },
  age:      { type: Number, required: true, min: 0, max: 120 },
  relation: { type: String, enum: ['Spouse','Child','Parent','Sibling','Other'], default: 'Other' },
  diet:     { type: String, enum: ['No restriction','Vegetarian','Vegan','Gluten free'], default: 'No restriction' },
  avatar:   { type: String, default: '' },
  requestedItems: [{
    name: String,
    requestedAt: { type: Date, default: Date.now },
  }],
});

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  age:           { type: Number, default: 30, min: 0, max: 120 },
  username:      { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3 },
  password:      { type: String, required: true, minlength: 6 },
  avatar:        { type: String, default: '' },
  familySize:    { type: Number, default: 1, min: 1, max: 20 },
  monthlyBudget: { type: Number, default: 5000, min: 100 },
  preferences: {
    vegetarian: { type: Boolean, default: false },
    vegan:      { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    nonVeg:     { type: Boolean, default: true  },
  },
  familyMembers: [familyMemberSchema],
}, { timestamps: true });

// Hash password before every save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain text to hash
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never send password over API
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

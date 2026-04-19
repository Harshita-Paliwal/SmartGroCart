# SmartGroCart - MongoDB Schema Documentation

## Overview
4 collections, all managed by Mongoose ODM.
Mongoose auto-creates collections on first write - no manual setup needed.

---

## 1. `users` Collection

```js
{
  _id:           ObjectId,          // auto-generated primary key
  name:          String,            // display name e.g. "Arjun Sharma"
  age:           Number,            // owner age for profile display/editing
  username:      String,            // unique login handle (lowercase) e.g. "arjun99"
  password:      String,            // bcrypt hashed - NEVER stored plain text
  avatar:        String,            // profile picture as a base64 data URL
  familySize:    Number,            // 1-20, used to scale qty suggestions
  monthlyBudget: Number,            // INR e.g. 8000
  preferences: {
    vegetarian:  Boolean,
    vegan:       Boolean,
    glutenFree:  Boolean,
    nonVeg:      Boolean,
  },
  familyMembers: [                  // embedded sub-documents
    {
      _id:      ObjectId,           // auto-generated
      name:     String,
      age:      Number,
      relation: String,             // "Spouse"|"Child"|"Parent"|"Sibling"|"Other"
      diet:     String,             // "No restriction"|"Vegetarian"|"Vegan"|"Gluten free"
      memberId: String,             // readable join ID for shared-family flows
      avatar:   String,             // family photo as base64 data URL
      requestedItems: [             // simple list of requested item names
        {
          name: String,
          requestedAt: Date,
        }
      ],
    }
  ],
  createdAt:     Date,              // auto (timestamps:true)
  updatedAt:     Date,              // auto (timestamps:true)
}
```

**Indexes:** `username` (unique)
**Auth:** Login uses `username + password` only - no email, no OTP.
**Password:** bcrypt hashed with salt rounds = 12 in pre-save hook.

---

## 2. `products` Collection

```js
{
  _id:        ObjectId,
  name:       String,               // e.g. "Basmati Rice"
  category:   String,               // enum: Dairy|Vegetables|Fruits|Meat|
                                    //       Grains|Beverages|Snacks|Household|
                                    //       Personal Care|Other
  price:      Number,               // INR e.g. 90
  unit:       String,               // e.g. "kg", "litre", "dozen", "piece"
  expiryDays: Number,               // days until expiry after purchase
                                    // used by expiry alert system
  imageEmoji: String,               // UI display e.g. "🍚"
  tags:       [String],             // e.g. ["staple","daily","protein"]
  isActive:   Boolean,              // soft-delete flag (default true)
  createdAt:  Date,
  updatedAt:  Date,
}
```

**Seed:** POST `/api/products/seed` loads 35 Indian grocery items.
**Note:** `expiryDays` is the key field - it drives the expiry alert engine.

---

## 3. `carts` Collection

```js
{
  _id:       ObjectId,
  user:      ObjectId,              // ref -> users._id  (UNIQUE - one cart per user)
  items: [                          // embedded array (denormalised snapshot)
    {
      _id:        ObjectId,
      product:    ObjectId,         // ref -> products._id (optional)
      name:       String,           // snapshot - not affected by product price changes
      category:   String,
      price:      Number,           // snapshot price at time of add
      quantity:   Number,           // min 1
      expiryDays: Number,           // copied from product
      imageEmoji: String,
      requestedBy: String,          // family member who requested it
      addedBy:    String,           // who added it to cart
      forWhom:    String,           // intended person / group
      addedAt:    Date,
    }
  ],
  createdAt: Date,
  updatedAt: Date,
}
```

**Design note:** Items are embedded (denormalised). Price is snapshotted at add-time
so changing a product's price won't alter existing cart items.
**One cart per user** - enforced by `unique: true` on `user` field.
**Budget check:** `GET /api/cart` returns `budgetWarning: true` when cart total > 80% of monthlyBudget.

---

## 4. `purchases` Collection

```js
{
  _id:         ObjectId,
  user:        ObjectId,            // ref -> users._id
  items: [                          // snapshot of cart items at checkout
    {
      product:    ObjectId,         // ref -> products._id
      name:       String,
      category:   String,
      price:      Number,           // price at time of purchase
      quantity:   Number,
      expiryDays: Number,           // used to calculate expiry date later
      imageEmoji: String,
      requestedBy: String,
      addedBy:    String,
      forWhom:    String,
    }
  ],
  totalAmount: Number,              // sum of price*quantity for all items
  month:       String,              // "YYYY-MM" e.g. "2025-06"
                                    // auto-set in pre-save hook
                                    // indexed - used for fast chart aggregation
  createdAt:   Date,
  updatedAt:   Date,
}
```

**Design notes:**
- Items are denormalised (embedded) - preserves historical prices forever.
- `month` field is pre-computed for fast MongoDB aggregation in spending charts.
- `expiryDays` + `createdAt` -> calculate expiry date in expiry alert engine.
- Used by suggestion engine to analyse purchase frequency per product.

---

## Relationships Diagram

```
users (1) ---------------- (1) carts
  |                          |
  |                          └-- items[] (embedded)
  |
  └------------------------ (many) purchases
                             |
                             └-- items[] (embedded)

products -------- referenced in -------- carts.items[].product
         -------- referenced in -------- purchases.items[].product
```

---

## MongoDB Aggregation Queries Used

### Monthly spending chart
```js
Purchase.aggregate([
  { $match: { user: userId } },
  { $group: { _id: '$month', total: { $sum: '$totalAmount' } } },
  { $sort: { _id: -1 } },
  { $limit: 6 }
])
```

### Spending by category
```js
Purchase.aggregate([
  { $match: { user: userId } },
  { $unwind: '$items' },
  { $group: {
    _id: '$items.category',
    total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
  }},
  { $sort: { total: -1 } }
])
```

---

## Indexes Summary

| Collection | Field      | Type   | Purpose                    |
|------------|------------|--------|----------------------------|
| users      | username   | unique | fast login lookup          |
| carts      | user       | unique | one cart per user          |
| purchases  | month      | index  | fast aggregation for charts|

---

## Mongoose Setup Notes

1. Mongoose creates all collections automatically on first document insert.
2. No manual schema creation or `db.createCollection()` needed.
3. `timestamps: true` auto-adds `createdAt` and `updatedAt` to all schemas.
4. Embedded sub-documents (familyMembers, cart items, purchase items) each
   get their own `_id` automatically - use this for update/delete by ID.

# 🛒 SmartGroCart — AI-Powered Smart Grocery Planner (MERN)

## ⚡ Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env — fill in MONGO_URI and JWT_SECRET

# 3. Run (both frontend + backend)
npm run dev
```
- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

## 📁 File Structure

```
smartgrocart/
├── package.json                    ← root (runs both with concurrently)
├── server/
│   ├── index.js                    ← Express + MongoDB entry
│   ├── .env.example                ← copy to .env and fill in values
│   ├── middleware/
│   │   └── auth.js                 ← JWT verification middleware
│   ├── models/
│   │   ├── SCHEMA.md               ← ⭐ FULL DB SCHEMA DOCUMENTATION
│   │   ├── User.js                 ← username+password auth, family, budget
│   │   ├── Product.js              ← grocery catalog
│   │   ├── Cart.js                 ← one cart per user (embedded items)
│   │   └── Purchase.js             ← order history (embedded items)
│   ├── routes/
│   │   ├── auth.js                 ← register, login, me, profile
│   │   ├── products.js             ← list, seed, CRUD
│   │   ├── cart.js                 ← get, add, update, remove, clear
│   │   ├── purchases.js            ← checkout, history, stats
│   │   ├── suggestions.js          ← rules, expiry, Claude AI
│   │   └── family.js               ← add/edit/delete members
│   └── utils/
│       ├── seedProducts.js         ← 35 Indian grocery items
│       └── suggestionEngine.js     ← rule-based frequency engine
└── client/src/
    ├── api/
    │   ├── axios.ts                ← Axios instance + JWT interceptors
    │   └── index.ts                ← all API call functions
    ├── context/AuthContext.tsx     ← global auth state (React Context)
    ├── components/Sidebar.tsx      ← app navigation
    └── pages/
        ├── LandingPage.tsx         ← animated marketing landing page
        ├── AuthPage.tsx            ← login + register (NO OTP, NO email)
        ├── Dashboard.tsx           ← stats, charts, suggestions, alerts
        ├── ShopPage.tsx            ← browse products + add to cart
        ├── CartPage.tsx            ← cart + budget bar + checkout
        ├── SuggestPage.tsx         ← rule-based + Claude AI + expiry tabs
        ├── FamilyPage.tsx          ← add/remove family members
        ├── HistoryPage.tsx         ← past orders + spending charts
        └── ProfilePage.tsx         ← edit profile, password, dietary prefs

```

## 🗄 MongoDB Setup

### Option A — Local
```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Ubuntu
sudo apt install mongodb && sudo systemctl start mongodb

# Windows — download from mongodb.com/try/download/community
```
Set: `MONGO_URI=mongodb://localhost:27017/smartgrocart`

### Option B — Atlas (free cloud)
1. Go to cloud.mongodb.com → create free cluster
2. Connect → Drivers → copy the URI
3. Set: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartgrocart`

> Mongoose creates all collections automatically — no manual setup needed.

## 🌐 API Reference

| Method | Endpoint                    | Auth | Description                    |
|--------|-----------------------------|------|--------------------------------|
| POST   | /api/auth/register          | —    | Register (username + password) |
| POST   | /api/auth/login             | —    | Login (no OTP, no email)       |
| GET    | /api/auth/me                | ✅   | Get current user               |
| PUT    | /api/auth/profile           | ✅   | Update profile                 |
| GET    | /api/products               | ✅   | List products                  |
| POST   | /api/products/seed          | ✅   | Seed 35 demo products          |
| POST   | /api/products/seed/force    | ✅   | Wipe + re-seed                 |
| GET    | /api/cart                   | ✅   | Get cart + budget info         |
| POST   | /api/cart/add               | ✅   | Add item to cart               |
| PUT    | /api/cart/item/:id          | ✅   | Update item quantity           |
| DELETE | /api/cart/item/:id          | ✅   | Remove item                    |
| DELETE | /api/cart/clear             | ✅   | Empty cart                     |
| POST   | /api/purchases/checkout     | ✅   | Checkout → creates purchase    |
| GET    | /api/purchases              | ✅   | Purchase history               |
| GET    | /api/purchases/stats        | ✅   | Monthly + category charts      |
| GET    | /api/suggestions            | ✅   | Rule-based suggestions         |
| GET    | /api/suggestions/expiry     | ✅   | Items expiring ≤3 days         |
| POST   | /api/suggestions/ai         | ✅   | Claude AI suggestions          |
| GET    | /api/family                 | ✅   | List family members            |
| POST   | /api/family                 | ✅   | Add family member              |
| PUT    | /api/family/:id             | ✅   | Edit family member             |
| DELETE | /api/family/:id             | ✅   | Remove family member           |

## 🧠 AI (Claude) Setup
Add to `server/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
App works fully without it — AI tab shows a clear message and the rule-based tab always works.

## ✅ Features
- Landing page with animated marquee + feature cards
- Login/Register — username + password ONLY (no email, no OTP)
- JWT auth (7-day tokens), bcrypt password hashing
- Family member management (name, age, relation, dietary preference)
- 35 Indian grocery products (seed via one click)
- Shopping cart with real-time budget tracking
- Budget warning bar (turns amber at 60%, red at 80%)
- Purchase history with expandable orders + category charts
- Rule-based AI: frequency analysis, family size quantity scaling
- Expiry alerts (items expiring within 3 days)
- Claude AI suggestions (optional, needs API key)
- Dark theme — Syne + DM Sans fonts

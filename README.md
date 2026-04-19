# SmartGroCart

SmartGroCart is a full-stack grocery planning application for households. It helps users manage shopping, track spending against a monthly budget, maintain family-specific requests, review purchase history, and get smart replenishment suggestions based on past buying patterns.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Core Features

- Username/password authentication
- Family member management with dietary preferences
- Grocery catalog browsing and cart management
- Shared family requests inside the cart
- Monthly budget tracking with warning thresholds
- Purchase history and category/month spending summaries
- Rule-based smart suggestions from purchase frequency
- Expiry alerts for recently purchased items

## Project Structure

```text
smartgrocart/
  client/                 # Vite React frontend
    src/
      api/                # API modules and axios setup
      components/         # Shared UI components
      context/            # Auth context
      pages/              # App screens
      types/              # Shared frontend types
      utils/              # Frontend helpers
    index.html
    vite.config.ts

  server/                 # Express backend
    config/               # Environment and DB connection setup
    controllers/          # Route handlers
    middleware/           # Express middleware
    models/               # Mongoose models
    routes/               # API route definitions
    services/             # Business logic helpers
    utils/                # Seed and suggestion helpers
    app.js
    index.js
```

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Create `server/.env` from `server/.env.example` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartgrocart
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000,https://smartgrocart.vercel.app
```

### 3. Run the app

From the project root:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Available Scripts

### Root

```bash
npm run dev
npm run server
npm run client
npm run build:client
```

### Client

```bash
cd client
npm run dev
npm run build
npm run preview
```

### Server

```bash
cd server
npm run dev
npm start
```

## Backend Overview

The backend is split by responsibility:

- `routes/` maps endpoints
- `controllers/` handle request/response flow
- `services/` contain reusable business logic
- `models/` define MongoDB collections with Mongoose
- `middleware/` handles auth and shared request concerns

This keeps data access, API wiring, and application logic separate and easier to maintain.

## Database Overview

The main collections are:

- `users`
- `products`
- `carts`
- `purchases`

Detailed schema notes are documented in [server/models/SCHEMA.md](/c:/My_projects/smartgrocart-final/sgc/server/models/SCHEMA.md).

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Products

- `GET /api/products`
- `POST /api/products/seed`
- `POST /api/products/seed/force`

### Cart

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/item/:itemId`
- `DELETE /api/cart/item/:itemId`
- `DELETE /api/cart/clear`

### Purchases

- `POST /api/purchases/checkout`
- `GET /api/purchases`
- `GET /api/purchases/stats`

### Suggestions

- `GET /api/suggestions`
- `GET /api/suggestions/expiry`

### Family

- `GET /api/family`
- `POST /api/family`
- `PUT /api/family/:memberId`
- `DELETE /api/family/:memberId`

## Notes

- MongoDB collections are created automatically by Mongoose on first write.
- The frontend uses a Vite dev proxy for `/api` requests during local development.
- The project currently uses an in-app page-based navigation flow rather than React Router.

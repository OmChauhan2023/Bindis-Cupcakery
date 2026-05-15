# Bindi's Cupcakery

A full-stack e-commerce web app for **Bindi's Cupcakery** — a Surat-based bakery selling cupcakes, cakes, desserts, and gift boxes. Built with Next.js 15, Prisma, SQLite, and Material UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router + Turbopack) |
| Language | TypeScript |
| UI Library | Material UI (MUI) v5 |
| Animations | Framer Motion |
| ORM | Prisma 7 |
| Database | SQLite (via `@prisma/adapter-better-sqlite3`) |
| Auth | JWT (`jsonwebtoken` + `bcryptjs`) stored in cookie |
| Package Manager | npm |

---

## Pages

### Public

| Route | Description |
|---|---|
| `/` | Landing page — hero, featured products, testimonials, about snippet |
| `/products` | Full product catalog with search, category filter, sort, and grid/list toggle. Clicking any product opens a Quick View modal. |
| `/cart` | Shopping cart — line items with customization chips, quantity controls, promo code field, delivery fee logic, order summary |
| `/cart/checkout` | Checkout form — customer details, payment method selector, live order summary with promo + delivery breakdown |
| `/cart/confirmation` | Post-order confirmation page |
| `/review` | Public review form — product dropdown, star rating, comment; shows all published reviews |
| `/gallery` | Photo gallery with hero section and image grid |
| `/contact` | Contact page with WhatsApp link, phone, and location |

### Admin (protected)

| Route | Description |
|---|---|
| `/admin/login` | Admin login — JWT cookie set on success |
| `/admin/dashboard` | Live dashboard — stat cards (orders, revenue, customers, products), recent orders, recent reviews, top products by units sold, catalog breakdown by category, quick-action buttons |
| `/admin/products` | Product management — add, edit, delete products |
| `/admin/orders` | Order management — view all orders with status |
| `/admin/customers` | Customer list pulled from DB |
| `/admin/reviews` | Review moderation — approve / delete |

Admin pages are wrapped by `AdminShell` which guards against unauthenticated access by reading the `adminToken` cookie client-side, and all admin API routes verify the JWT server-side.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | List all products (auto-seeds 18 on first request) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |
| POST | `/api/orders` | Place order — validates products server-side, applies promo, persists Order + OrderItems |
| GET | `/api/reviews` | List all reviews |
| POST | `/api/reviews` | Submit a review (find-or-create user by email) |
| GET | `/api/users` | List users |
| POST | `/api/register` | Create initial admin account |
| POST | `/api/admin/login` | Admin login — verifies bcrypt hash, returns JWT cookie |
| POST | `/api/admin/logout` | Clears admin cookie |
| GET | `/api/admin/stats` | Aggregate stats: counts, revenue, pending orders, recent activity, top products, category breakdown |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/[id]` | Update order status |
| GET | `/api/admin/reviews` | List reviews for moderation |
| PATCH | `/api/admin/reviews/[id]` | Approve / delete review |
| GET | `/api/admin/customers` | List all customers |

---

## Key Features

### Product Catalog
- 18 products across 5 categories: Cupcakes, Cakes, Desserts, Gift Boxes, Seasonal
- Auto-seeded from `src/lib/seed.ts` on first API request — no manual migration needed
- Quick View modal per product: image, description, ingredients, allergens, shelf life, story, per-category customization options (flavour, frosting, size, colour, message, etc.)

### Cart & Checkout
- `CartContext` tracks items by `cartKey` (product ID + customizations fingerprint) so different customizations of the same product are separate line items
- Promo codes validated client-side in `CartContext` and server-side in `/api/orders` — fake codes passed directly to the API are silently rejected
- Active promo codes: `BINDI10` (10% off), `FIRST10` (10% off first order)
- Delivery fee: ₹40 under ₹500 subtotal, free at ₹500+
- Full breakdown (subtotal → promo discount → delivery → total) shown on both cart and checkout pages

### Order Pipeline
- `POST /api/orders` find-or-creates a User by email, recomputes server-side total, persists Order and OrderItems (with customization notes)
- Order total can never be manipulated by a client-side price override — server caps line unit price to the DB price range

### Reviews
- Public form lets customers submit star ratings and comments with product association
- Reviews stored in DB, shown live on the `/review` page after submit
- Admin can approve or delete via `/admin/reviews`

### Admin Dashboard (live)
- All stats fetched from `/api/admin/stats` at page load — no static mock data
- Recent Orders feed, Recent Reviews feed, Top 5 Products by units sold with progress bars, Catalog Breakdown table

### Contact / WhatsApp
- All phone numbers centralized in `src/lib/contact.ts` — one change updates every page
- Current number: +91 99989-86977

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── components/AdminShell.tsx   # Sidebar layout + auth guard
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx
│   │   ├── customers/page.tsx
│   │   └── reviews/page.tsx
│   ├── api/
│   │   ├── admin/stats/route.ts
│   │   ├── customers/route.ts
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── orders/route.ts
│   │   ├── orders/[id]/route.ts
│   │   ├── products/route.ts
│   │   ├── products/[id]/route.ts
│   │   └── reviews/route.ts
│   ├── cart/
│   │   ├── components/
│   │   │   ├── CartContext.tsx
│   │   │   ├── CartPage.tsx
│   │   │   └── CheckOut.tsx
│   │   ├── checkout/page.tsx
│   │   └── confirmation/page.tsx
│   ├── contact/page.tsx
│   ├── gallery/page.tsx
│   ├── products/
│   │   ├── components/QuickViewModal.tsx
│   │   └── page.tsx
│   ├── review/page.tsx
│   └── page.tsx                        # Home / landing
├── components/
│   └── LayoutShell.tsx                 # Suppresses Header/Footer on /admin/* routes
├── lib/
│   ├── auth.ts                         # verifyAdmin() JWT helper
│   ├── categories.ts                   # categoryFor() — pure, no DB import
│   ├── contact.ts                      # Centralized phone/WhatsApp constants
│   ├── prisma.ts                       # Prisma client singleton
│   ├── productDetails.ts               # Per-product details + customization schema
│   ├── promo.ts                        # PROMOS array + lookupPromo() (client + server)
│   └── seed.ts                         # ensureSeeded() — 18 products on first request
prisma/
└── schema.prisma
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd "Bindis Cupcakery"
npm install

# 2. Push the schema to SQLite (creates bindis.db automatically)
npx prisma db push

# 3. Create the admin account
npx prisma studio
# or run a seed script / use the /api/register endpoint once

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./bindis.db"
JWT_SECRET="your-secret-key-here"
```

### Admin Credentials (default)

| Field | Value |
|---|---|
| Username | admin |
| Password | admin123 |

Login at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Available Scripts

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npx prisma studio   # DB GUI
npx prisma db push  # Apply schema changes
```

---

*Made with love for Bindi's Cupcakery, Surat*

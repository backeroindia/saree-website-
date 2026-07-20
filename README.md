# PattuNool — Saree E-commerce Website

A full-stack saree e-commerce store built with Next.js (App Router), Prisma/SQLite, and Tailwind CSS. Includes a customer storefront (browse, cart, checkout, order history) and an admin panel (product & order management).

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** — maroon/gold/cream saree-brand theme
- **Prisma 7** + SQLite (`better-sqlite3` driver adapter) — swap to Postgres later by changing the datasource and adapter
- **Auth**: custom email/password auth with `bcryptjs` (hashing) + `jose` (signed JWT in an httpOnly cookie) — no third-party auth service
- **Cart**: `zustand` (persisted to `localStorage`), server always recalculates prices at checkout
- **Validation**: `zod` on every API route

## Getting Started

```bash
npm install
npm run seed   # creates categories, 8 sample products, admin + demo customer accounts
npm run dev
```

Open http://localhost:3000

### Demo accounts (created by `npm run seed`)

| Role     | Email                  | Password    |
|----------|-------------------------|-------------|
| Admin    | admin@saree.shop        | admin123    |
| Customer | customer@example.com    | customer123 |

Admin panel: http://localhost:3000/admin

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — SQLite file path (defaults to `file:./dev.db`)
- `AUTH_SECRET` — random secret used to sign session JWTs (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` — optional. Leave blank to run in **Cash on Delivery only** mode (online payment option is disabled in the UI until these are set, and the checkout API rejects `RAZORPAY` as a payment method until real integration is wired in).

## Project Structure

```
prisma/schema.prisma       Database models (User, Product, Category, Order, OrderItem, Address, Review)
prisma/seed.ts             Seed script — run with `npm run seed`
src/lib/db.ts              Prisma client singleton
src/lib/auth.ts            Password hashing + JWT session helpers
src/lib/cart-store.ts      Client-side cart (zustand)
src/lib/products.ts        Product/category query helpers
src/app/                   Storefront + admin pages (App Router)
src/app/api/                REST-style route handlers (auth, checkout, admin)
public/images/products/    Product photography, grouped by product folder
```

## Product Images

Real saree photography lives in `public/images/products/<folder>/photo-N.png`. The admin "Add/Edit Product" form includes an image picker that lists everything under that directory — add new photos to a folder (or a new folder) on disk and they'll show up there automatically, no code changes needed.

## Notes on Payments

Only **Cash on Delivery** is wired up end-to-end. The checkout UI shows an online-payment option but it stays disabled until `NEXT_PUBLIC_RAZORPAY_KEY_ID` (and the matching server-side keys) are set, and the `/api/checkout` route currently rejects the `RAZORPAY` method outright — this is intentional so the site never claims to accept online payments it can't actually process. Wiring up real Razorpay checkout (order creation + signature verification webhook) is the main remaining step for a production launch.

## Deployment

This app has no external service dependencies beyond the database, so it can be deployed anywhere Next.js runs. For SQLite in production you'd typically switch to a hosted Postgres (e.g. via Vercel Marketplace) — update `prisma/schema.prisma`'s datasource provider and the adapter in `src/lib/db.ts` accordingly, then run `npx prisma migrate deploy`.

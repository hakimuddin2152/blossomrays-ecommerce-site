<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

# BlossomRays Site — Project Context

**Spec/Plan/Tasks**: `specs/001-blossomrays-ecommerce/`

## Tech Stack
- **Framework**: Next.js 14 (App Router) — TypeScript
- **Styling**: Tailwind CSS 3.4 + Framer Motion 11
- **Database/Auth**: Supabase (PostgreSQL + Row Level Security + Auth)
- **Payments**: Stripe Checkout + Webhooks
- **State**: Zustand (cart, localStorage persist)
- **Hosting**: Netlify (`@netlify/plugin-nextjs`)

## Key Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run type-check  # TypeScript check only
```

## Environment Variables
Copy `.env.example` → `.env.local` and fill in Supabase + Stripe keys.

## Database
Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor once.

## Route Map
- `/` — Homepage
- `/products` — Listing
- `/products/[slug]` — Product detail
- `/cart` — Cart
- `/checkout` — Checkout (→ Stripe)
- `/order-confirmation/[orderId]` — Post-purchase
- `/account/*` — Auth-gated account & orders
- `/login`, `/register` — Auth pages
- `/admin/*` — Admin-only dashboard (role = 'admin' in profiles table)
- `/api/stripe/checkout` — POST: create Stripe session
- `/api/stripe/webhook` — POST: Stripe events → create orders
- `/api/orders/[id]` — GET / PATCH order
- `/api/products/[id]` — PATCH product (admin)


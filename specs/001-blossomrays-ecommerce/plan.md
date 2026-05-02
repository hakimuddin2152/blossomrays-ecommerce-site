# Implementation Plan: BlossomRays E-Commerce Website

**Branch**: `001-blossomrays-ecommerce` | **Date**: 2026-04-30 | **Spec**: [specs/001-blossomrays-ecommerce/spec.md](./spec.md)

---

## Summary

Build a production-ready e-commerce storefront for BlossomRays selling Lavender and Rose car air fresheners. The site uses Next.js 14 (App Router) for SSR/SEO, Supabase for database and auth, Stripe for payments, and deploys to Netlify. A custom admin dashboard handles order fulfilment management.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS  
**Framework**: Next.js 14 (App Router, Server Components)  
**Styling**: Tailwind CSS 3.4 + Framer Motion 11  
**Database**: Supabase (PostgreSQL + Row Level Security + Auth)  
**Payments**: Stripe (Checkout Sessions + Webhooks)  
**Deployment**: Netlify via `@netlify/plugin-nextjs`  
**Storage**: Supabase Storage (product images)  
**Testing**: Not required for v1  
**Target Platform**: Web (desktop + mobile responsive)  
**Performance Goals**: LCP < 2.5s, Lighthouse SEO ≥ 90  
**Constraints**: Netlify free/starter tier; Supabase free tier; no server-side session store needed (JWT via Supabase)  
**Scale/Scope**: 2 products, low-medium traffic launch

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `cream` | `#FFF9F7` | Page background |
| `cream-dark` | `#F5EDE8` | Section alternating bg |
| `lavender-light` | `#E8DFF0` | Lavender product card bg |
| `lavender` | `#9B7FB6` | Primary lavender accent |
| `lavender-dark` | `#6B4E8A` | Lavender hover / CTA |
| `rose-light` | `#FAE8EC` | Rose product card bg |
| `rose` | `#D4788A` | Primary rose accent |
| `rose-dark` | `#A85468` | Rose hover / CTA |
| `plum` | `#2D1B1F` | Primary text |
| `gold` | `#C9A86C` | Luxury accent / borders |
| `muted` | `#8B7B82` | Secondary text |

### Typography

- **Display / H1**: Cormorant Garamond 700, italic — hero headings
- **H2–H3**: Cormorant Garamond 600 — section headings  
- **Body**: DM Sans 400/500 — all body text, UI labels
- **Price / Badge**: DM Sans 600 — prices, status badges

### Component Language

- **Buttons**: Rounded-full pill shape, gradient fill or outlined variant
- **Cards**: `rounded-2xl`, white bg, `shadow-soft` (custom shadow), hover lift `translateY(-4px)`
- **Sections**: Organic wave SVG dividers between major sections
- **Inputs**: `rounded-xl`, subtle border, focus ring in brand color
- **Badges**: Small pill with colour-coded status (order status)

---

## Project Structure

```text
site/
├── specs/
│   └── 001-blossomrays-ecommerce/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── src/
│   ├── app/
│   │   ├── (store)/                    # Public storefront layout
│   │   │   ├── layout.tsx              # Storefront shell (nav + footer)
│   │   │   ├── page.tsx                # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx            # Products listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Product detail + JSON-LD
│   │   │   ├── cart/
│   │   │   │   └── page.tsx            # Cart review
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx            # Checkout form + Stripe trigger
│   │   │   ├── order-confirmation/
│   │   │   │   └── [orderId]/
│   │   │   │       └── page.tsx        # Post-purchase confirmation
│   │   │   └── account/
│   │   │       ├── layout.tsx          # Auth guard wrapper
│   │   │       ├── page.tsx            # Account dashboard
│   │   │       └── orders/
│   │   │           ├── page.tsx        # Order history
│   │   │           └── [orderId]/
│   │   │               └── page.tsx    # Order detail
│   │   ├── (auth)/                     # Auth pages (no main nav)
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (admin)/                    # Admin layout (separate nav)
│   │   │   ├── layout.tsx              # Admin shell + role guard
│   │   │   └── admin/
│   │   │       ├── page.tsx            # Admin dashboard overview
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx        # All orders list
│   │   │       │   └── [orderId]/
│   │   │       │       └── page.tsx    # Order detail + status update
│   │   │       └── products/
│   │   │           ├── page.tsx        # Products list
│   │   │           └── [productId]/
│   │   │               └── page.tsx    # Edit product
│   │   ├── api/
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts        # POST: create Stripe Checkout session
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts        # POST: handle stripe events
│   │   │   ├── orders/
│   │   │   │   ├── route.ts            # GET: list orders (admin)
│   │   │   │   └── [orderId]/
│   │   │   │       └── route.ts        # GET/PATCH: order detail + status
│   │   │   └── products/
│   │   │       └── route.ts            # GET/PATCH: product management
│   │   ├── sitemap.ts                  # Dynamic sitemap
│   │   ├── robots.ts                   # robots.txt
│   │   ├── globals.css                 # Tailwind base + custom CSS
│   │   └── layout.tsx                  # Root layout (fonts, providers)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── WaveDivider.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   └── TestimonialsSection.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductJsonLd.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── admin/
│   │       ├── OrdersTable.tsx
│   │       ├── OrderStatusSelect.tsx
│   │       └── StatsCard.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   ├── server.ts               # Server-side Supabase client
│   │   │   └── middleware.ts           # Auth session refresh
│   │   ├── stripe/
│   │   │   ├── client.ts               # Stripe browser client
│   │   │   └── server.ts               # Stripe Node server SDK
│   │   └── utils/
│   │       ├── formatPrice.ts
│   │       ├── cn.ts                   # clsx + tailwind-merge helper
│   │       └── orderStatus.ts          # Status label/color mapping
│   ├── store/
│   │   └── cartStore.ts                # Zustand cart store (localStorage)
│   └── types/
│       ├── database.ts                 # Supabase generated types
│       └── index.ts                    # Shared domain types
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── lavender-freshener.jpg
│   │   └── rose-freshener.jpg
│   └── fonts/ (unused — using Google Fonts via next/font)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      # All tables + RLS policies
├── .env.example
├── .env.local                          # (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── netlify.toml
├── middleware.ts                       # Next.js edge middleware (auth)
├── package.json
└── tsconfig.json
```

---

## Architecture Decisions

### State Management
- **Cart**: Zustand with `persist` middleware → stored in `localStorage`. On checkout, cart contents are sent to the Stripe Checkout API route.
- **Auth State**: Supabase Auth handles sessions server-side; `@supabase/ssr` package used for cookie-based sessions in App Router.

### Payment Flow
```
User clicks "Checkout"
  → POST /api/stripe/checkout  (sends cart items + shipping info)
  → Creates Stripe Checkout Session
  → Redirects to Stripe hosted page
  → On success: Stripe redirects to /order-confirmation?session_id=...
  → Stripe fires webhook → POST /api/stripe/webhook
  → Webhook validates signature, creates Order + OrderItems in Supabase
  → Sets order.status = 'paid'
```

### Admin Access Control
- Supabase `profiles.role` column checked server-side in admin layout
- Route group `(admin)` has a layout that calls `supabase.from('profiles').select('role')` and redirects non-admins to `/`
- All admin API routes also validate role independently

### SEO Strategy
- Next.js `generateMetadata()` on every page
- `<ProductJsonLd>` component outputs `<script type="application/ld+json">` with Product schema
- `app/sitemap.ts` dynamically generates sitemap from database
- Next.js Image component for all images (automatic WebP + lazy loading)
- Semantic HTML throughout (h1 per page, article/section/nav/main)

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Server-only, never exposed to browser

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=                # Server-only
STRIPE_WEBHOOK_SECRET=            # Server-only

# App
NEXT_PUBLIC_SITE_URL=https://blossomrays.netlify.app
```

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- profiles (extends auth.users)
-- products
-- orders
-- order_items

-- RLS Policies:
--   products: SELECT public; INSERT/UPDATE/DELETE admin only
--   orders: SELECT own orders (user_id = auth.uid()); admin sees all
--   order_items: SELECT via order ownership
--   profiles: SELECT/UPDATE own profile; admin sees all
```

See `supabase/migrations/001_initial_schema.sql` for full definitions.

---

## Phases

| Phase | Scope | Blocks |
|---|---|---|
| 0 | Config files, env, package.json, Supabase schema | Nothing |
| 1 | Design system, shared components (Button, Card, Badge, Input, WaveDivider) | Phase 2+ |
| 2 | Layout (Navbar, Footer), Homepage | Phase 3 |
| 3 | Product listing + detail pages | Phase 4 |
| 4 | Cart (Zustand store + CartDrawer) | Phase 5 |
| 5 | Checkout + Stripe integration + webhook | Phase 6 |
| 6 | Auth pages (login/register) + account pages | Phase 7 |
| 7 | Admin dashboard (orders + products) | — |
| 8 | SEO (sitemap, robots, JSON-LD, metadata) | — |
| 9 | Netlify config + deployment readiness | — |

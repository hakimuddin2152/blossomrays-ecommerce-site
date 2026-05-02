# Tasks: BlossomRays E-Commerce Website

**Input**: Design documents from `/specs/001-blossomrays-ecommerce/`
**Prerequisites**: plan.md ✅, spec.md ✅

---

## Phase 0: Project Setup

- [x] T001 Create `package.json` with all dependencies at `site/package.json`
- [x] T002 [P] Create `tsconfig.json` at `site/tsconfig.json`
- [x] T003 [P] Create `next.config.ts` at `site/next.config.ts`
- [x] T004 [P] Create `tailwind.config.ts` + `postcss.config.js` at site root
- [x] T005 [P] Create `.env.example` at site root
- [x] T006 [P] Create `netlify.toml` at site root
- [x] T007 Create Supabase migration SQL at `site/supabase/migrations/001_initial_schema.sql`

---

## Phase 1: Design System & Shared UI

- [x] T008 Create `src/app/globals.css` (Tailwind directives + custom utilities)
- [x] T009 Create `src/app/layout.tsx` (root layout: fonts, providers, metadata base)
- [x] T010 [P] Create `src/lib/utils/cn.ts` (clsx + tailwind-merge)
- [x] T011 [P] Create `src/lib/utils/formatPrice.ts`
- [x] T012 [P] Create `src/lib/utils/orderStatus.ts`
- [x] T013 [P] Create `src/types/index.ts`
- [x] T014 [P] Create `src/components/ui/Button.tsx`
- [x] T015 [P] Create `src/components/ui/Badge.tsx`
- [x] T016 [P] Create `src/components/ui/Card.tsx`
- [x] T017 [P] Create `src/components/ui/Input.tsx`
- [x] T018 [P] Create `src/components/ui/WaveDivider.tsx`

---

## Phase 2: Layout Shell

- [x] T019 Create `src/components/layout/Navbar.tsx` (logo, nav links, cart icon with count)
- [x] T020 Create `src/components/layout/Footer.tsx` (links, brand tagline)
- [x] T021 Create `src/app/(store)/layout.tsx` (wraps Navbar + Footer)
- [x] T022 Create `src/app/(auth)/layout.tsx` (minimal centered layout)

---

## Phase 3: Homepage (User Story 1 - Discovery)

- [x] T023 Create `src/components/home/HeroSection.tsx`
- [x] T024 [P] Create `src/components/home/FeaturedProducts.tsx`
- [x] T025 [P] Create `src/components/home/BenefitsSection.tsx`
- [x] T026 [P] Create `src/components/home/TestimonialsSection.tsx`
- [x] T027 Create `src/app/(store)/page.tsx` (composing all home sections)

---

## Phase 4: Products (User Story 1)

- [x] T028 Create `src/components/products/ProductCard.tsx`
- [x] T029 [P] Create `src/components/products/ProductGrid.tsx`
- [x] T030 [P] Create `src/components/products/ProductJsonLd.tsx`
- [x] T031 Create `src/app/(store)/products/page.tsx` (SSG product listing)
- [x] T032 Create `src/app/(store)/products/[slug]/page.tsx` (SSG product detail + JSON-LD + Add to Cart)

---

## Phase 5: Cart (User Story 1)

- [x] T033 Create `src/store/cartStore.ts` (Zustand + localStorage persist)
- [x] T034 Create `src/components/cart/CartItem.tsx`
- [x] T035 [P] Create `src/components/cart/CartSummary.tsx`
- [x] T036 [P] Create `src/components/cart/CartDrawer.tsx` (slide-over panel)
- [x] T037 Create `src/app/(store)/cart/page.tsx`

---

## Phase 6: Checkout & Payments (User Story 1 — Core)

- [x] T038 Create `src/lib/stripe/server.ts` (Stripe Node SDK init)
- [x] T039 [P] Create `src/lib/stripe/client.ts` (Stripe.js browser init)
- [x] T040 Create `src/app/api/stripe/checkout/route.ts` (POST: create Checkout Session)
- [x] T041 Create `src/app/api/stripe/webhook/route.ts` (POST: handle `checkout.session.completed`)
- [x] T042 Create `src/app/(store)/checkout/page.tsx` (shipping form + redirect to Stripe)
- [x] T043 Create `src/app/(store)/order-confirmation/[orderId]/page.tsx`

---

## Phase 7: Supabase & Auth (User Story 2)

- [x] T044 Create `src/lib/supabase/client.ts` (browser Supabase client)
- [x] T045 [P] Create `src/lib/supabase/server.ts` (server Supabase client using cookies)
- [x] T046 Create `src/middleware.ts` (Next.js middleware: refresh Supabase session)
- [x] T047 Create `src/app/(auth)/login/page.tsx`
- [x] T048 [P] Create `src/app/(auth)/register/page.tsx`
- [x] T049 Create `src/app/(store)/account/layout.tsx` (auth guard: redirect to /login if no session)
- [x] T050 Create `src/app/(store)/account/page.tsx` (account overview)
- [x] T051 Create `src/app/(store)/account/orders/page.tsx` (order history list)
- [x] T052 Create `src/app/(store)/account/orders/[orderId]/page.tsx` (order detail)
- [x] T053 Create `src/app/api/orders/route.ts` (GET orders for current user)
- [x] T054 Create `src/app/api/orders/[orderId]/route.ts` (GET single order)

---

## Phase 8: Admin Dashboard (User Story 3)

- [x] T055 Create `src/components/layout/AdminSidebar.tsx`
- [x] T056 [P] Create `src/components/admin/StatsCard.tsx`
- [x] T057 [P] Create `src/components/admin/OrdersTable.tsx`
- [x] T058 [P] Create `src/components/admin/OrderStatusSelect.tsx`
- [x] T059 Create `src/app/(admin)/layout.tsx` (admin shell + role guard)
- [x] T060 Create `src/app/(admin)/admin/page.tsx` (dashboard: stats + recent orders)
- [x] T061 Create `src/app/(admin)/admin/orders/page.tsx` (all orders with filters)
- [x] T062 Create `src/app/(admin)/admin/orders/[orderId]/page.tsx` (order detail + status update)
- [x] T063 Create `src/app/(admin)/admin/products/page.tsx` (products list)
- [x] T064 Create `src/app/(admin)/admin/products/[productId]/page.tsx` (edit product)
- [x] T065 Create `src/app/api/orders/[orderId]/route.ts` — extend with PATCH for status update (admin)
- [x] T066 Create `src/app/api/products/route.ts` (GET all + PATCH product — admin auth)

---

## Phase 9: SEO (User Story 4)

- [x] T067 Add `generateMetadata()` to homepage, products listing, product detail
- [x] T068 Add `generateMetadata()` to account, order confirmation pages
- [x] T069 Create `src/app/sitemap.ts` (dynamic sitemap)
- [x] T070 Create `src/app/robots.ts` (robots.txt)

---

## Phase 10: Final Polish

- [x] T071 Add `middleware.ts` Supabase session refresh for all routes
- [x] T072 Verify all env vars documented in `.env.example`
- [x] T073 Confirm `netlify.toml` correct for Next.js + webhook raw body

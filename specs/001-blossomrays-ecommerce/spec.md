# Feature Specification: BlossomRays E-Commerce Website

**Feature Branch**: `001-blossomrays-ecommerce`  
**Created**: 2026-04-30  
**Status**: Approved  
**Input**: User description: "E-commerce website selling lavender and rose car air fresheners, SEO optimized, Stripe payments, Netlify hosting, full order management for admin and user"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Shopper Discovers & Purchases a Product (Priority: P1)

A visitor lands on the BlossomRays site, browses the two products (Lavender & Rose car air fresheners), adds one to their cart, proceeds to checkout, enters shipping details, pays via Stripe, and receives an order confirmation.

**Why this priority**: Core revenue path. Without this, the business cannot operate.

**Independent Test**: Open the site, add "Lavender Car Air Freshener" to cart, complete Stripe test checkout, verify order confirmation page loads and email is implied.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they view the hero and product section, **Then** both products are displayed with images, names, prices, and an "Add to Cart" CTA.
2. **Given** a product is in the cart, **When** the user proceeds to checkout, **Then** Stripe Checkout loads pre-filled with the correct line items and total.
3. **Given** Stripe payment succeeds, **When** the webhook fires, **Then** the order is created in Supabase with status `paid` and the user sees a confirmation page with order ID.
4. **Given** payment fails, **When** Stripe returns an error, **Then** the user sees a clear error message and can retry without losing cart contents.

---

### User Story 2 — User Registers, Logs In & Views Order History (Priority: P2)

A customer creates an account or logs in, then views their past orders with status updates (pending → shipped → delivered).

**Why this priority**: Retention and trust. Customers need accountability for their orders.

**Independent Test**: Register a new account, place an order, navigate to `/account/orders`, verify the order list and detail view display correctly.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they click "Create Account" and submit valid credentials, **Then** a Supabase auth account is created and they are redirected to their dashboard.
2. **Given** a logged-in user, **When** they navigate to "My Orders", **Then** they see all their orders with status badges, dates, and totals.
3. **Given** a user clicks an order, **When** the detail page loads, **Then** they see itemised products, shipping address, and current fulfilment status.
4. **Given** an unauthenticated user visits `/account`, **When** the page loads, **Then** they are redirected to `/login`.

---

### User Story 3 — Admin Manages Orders & Products (Priority: P2)

An admin logs in at `/admin`, views all incoming orders, updates fulfilment status, and can manage product listings (edit price/stock/description).

**Why this priority**: Operations could not run without order visibility and status updates.

**Independent Test**: Log in as an admin user (role = `admin` in Supabase), navigate to `/admin/orders`, update an order status from `paid` to `shipped`, verify the status change persists and is reflected in the customer's order view.

**Acceptance Scenarios**:

1. **Given** an admin user, **When** they visit `/admin`, **Then** they see a dashboard with total orders, revenue, and recent order list.
2. **Given** an order with status `paid`, **When** the admin selects "Mark as Shipped", **Then** the order status updates to `shipped` in the database.
3. **Given** the admin navigates to Products, **When** they edit the Lavender product price, **Then** the new price is persisted and reflected on the storefront.
4. **Given** a non-admin authenticated user visits `/admin`, **When** the page loads, **Then** they receive a 403 forbidden response.

---

### User Story 4 — SEO-Optimised Public Pages (Priority: P3)

The site renders with server-side generated metadata, Open Graph tags, structured product data (JSON-LD), canonical URLs, and a sitemap.xml so that search engines can index and rank the pages effectively.

**Why this priority**: Long-term traffic acquisition. No immediate revenue impact at launch but critical for growth.

**Independent Test**: Run Lighthouse audit against the homepage and a product page; verify SEO score ≥ 90. Inspect page source for `<title>`, `<meta name="description">`, `<link rel="canonical">`, and JSON-LD `Product` schema.

**Acceptance Scenarios**:

1. **Given** a search engine bot crawls `/`, **When** it reads the HTML, **Then** it finds a unique `<title>`, meta description, OG image, and canonical tag.
2. **Given** a product page `/products/lavender-car-air-freshener`, **When** inspected, **Then** it contains JSON-LD with `@type: "Product"`, `name`, `description`, `offers.price`, and `offers.availability`.
3. **Given** the site is deployed, **When** a bot requests `/sitemap.xml`, **Then** it receives a valid sitemap listing homepage and both product URLs.
4. **Given** the site loads, **When** Google PageSpeed runs, **Then** Core Web Vitals are green (LCP < 2.5s on mobile with optimised images).

---

### Edge Cases

- What happens when a product goes out of stock (`stock = 0`)? → Show "Out of Stock" badge; disable Add to Cart button; do not allow checkout line item creation.
- What happens if a Stripe webhook is received twice for the same payment intent? → Idempotency check on `stripe_payment_intent_id`; ignore duplicate.
- What if a user's session expires mid-checkout? → Guest checkout is supported; order is linked to email; account created optionally post-purchase.
- What if the admin accidentally marks an order as shipped twice? → Status transitions are validated server-side; `shipped → shipped` is a no-op.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display both products (Lavender, Rose) with images, descriptions, prices, and stock status on the storefront.
- **FR-002**: System MUST support a persistent shopping cart (localStorage for guests, DB-backed for logged-in users).
- **FR-003**: System MUST integrate Stripe Checkout for secure payment processing.
- **FR-004**: System MUST create an order record in Supabase upon successful Stripe webhook confirmation.
- **FR-005**: System MUST send users to an order confirmation page after successful purchase.
- **FR-006**: System MUST allow users to register/login via email + password (Supabase Auth).
- **FR-007**: System MUST display a user's order history with status and line items.
- **FR-008**: System MUST provide an admin-only dashboard at `/admin` protected by role-based access control.
- **FR-009**: Admin MUST be able to view all orders and update their fulfilment status.
- **FR-010**: Admin MUST be able to edit product details (name, description, price, stock, images).
- **FR-011**: Every public page MUST include unique SEO metadata (`<title>`, `<meta description>`, canonical, OG).
- **FR-012**: Product pages MUST include JSON-LD structured data (`Product` schema).
- **FR-013**: System MUST serve a `/sitemap.xml` and `/robots.txt`.
- **FR-014**: Site MUST be deployable to Netlify with no server required (Next.js via `@netlify/plugin-nextjs`).

### Key Entities

- **Product**: id, name, slug, tagline, description, price (cents), compare_at_price, stock, images[], category (`lavender` | `rose`), is_active, seo_title, seo_description, created_at
- **Order**: id, user_id (nullable for guest), guest_email, status (`pending` | `paid` | `shipped` | `delivered` | `cancelled`), subtotal, shipping_cost, total, stripe_payment_intent_id, shipping_address (JSONB), created_at
- **OrderItem**: id, order_id, product_id, quantity, unit_price
- **Profile**: id (= auth.users.id), full_name, email, phone, role (`customer` | `admin`)
- **Address**: id, user_id, label, street_line_1, street_line_2, city, state, zip, country, is_default

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper can complete a purchase (product → cart → checkout → confirmation) in under 3 minutes on mobile.
- **SC-002**: Lighthouse SEO score ≥ 90 on homepage and product pages.
- **SC-003**: Stripe webhook correctly creates order within 5 seconds of payment confirmation.
- **SC-004**: Admin can update order status in ≤ 2 clicks from the orders list.
- **SC-005**: Site loads (LCP) under 2.5 seconds on a 4G mobile connection.
- **SC-006**: All 2 product pages indexed by Google within 2 weeks of launch (sitemap submitted).

---

## Assumptions

- Two products at launch: "Lavender Car Air Freshener" and "Rose Car Air Freshener" — each a single variant (no size options initially).
- Shipping is flat-rate ($4.99) for domestic; international shipping is out of scope for v1.
- No loyalty/rewards program in v1.
- Product images will be supplied separately; placeholder images used during development.
- Supabase free tier is sufficient for launch traffic.
- Admin users are created manually in Supabase (no admin self-registration flow).
- Returns/refunds are handled manually via Stripe dashboard; no self-serve refund UI in v1.
- Email notifications (order confirmation, shipping) are out of scope for v1 (can add Resend/SendGrid later).

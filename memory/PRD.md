# PAZOOKA — Streetwear E-Commerce Storefront

## Original Problem Statement
Build a website inspired by bonkerscorner.com and wtflex.in — a premium Gen-Z streetwear brand called PAZOOKA. White background, black typography, black sections, acid-lime accents used sparingly. Oversized bold condensed uppercase typography, editorial grids, huge full-width cinematic banners, smooth scrolling, image reveals, hover effects, marquee text, sticky navbar, promo bar, mega menu, collections, new drops, filters, quick add-to-cart, wishlist, responsive mobile design. Catalog: 10 oversized tees, 6 regular fit tees, 5 caps.

## User Personas
- Gen-Z streetwear shopper: browses drops, filters by fit, quick-adds sizes, checks out fast
- Hype collector: hunts LIMITED/NEW DROP tagged pieces, saves to wishlist
- Mobile-first browser: shops entirely from phone

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (reveals, drawers, parallax) + lenis (smooth momentum scroll), react-router-dom, sonner toasts, lucide icons
- Backend: FastAPI, routes under /api
- DB: MongoDB (motor) via MONGO_URL/DB_NAME env
- Fonts: Bebas Neue (display), Syne (subheads), Outfit (body), Space Mono (labels)
- Colors: black #0A0A0A base / white type / dim zinc-700 giant words / acid lime #D4FF00 labels+CTAs / crimson #EE2643 manifesto numbers + LIMITED tags — full dark scheme applied site-wide (home, shop, product, checkout, drawers, mega menu, footer)

## Core Requirements (static)
- 21-product seeded catalog (10 oversized, 6 regular, 5 caps), real photography, hover image swap
- Home: kinetic hero with masked line reveal + parallax, marquee strips, new drops grid, 2 huge campaign banners, collections bento, numbered manifesto, footer newsletter
- Shop: category tabs, tag chips, search, sort, result count, sticky filter bar
- Product detail: gallery, size selector + size guide, qty, add to cart, wishlist, related items
- Cart + wishlist drawers (localStorage persisted), free-shipping progress bar
- Demo checkout: form, promo code PAZOOKA10 (10%), server-computed totals, order confirmation

## Implemented (2026-09-19)
- Backend: GET /api/products (category/q/sort/tag filters), GET /api/products/{id}, POST /api/orders (server-side pricing, promo validation, free shipping ≥$75), idempotent product seed on startup
- Frontend: all pages and components above; data-testids throughout
- Verified: all API endpoints via curl; e2e flows via screenshots (quick add, cart, product detail, checkout, order confirmation, mobile menu)
- Hero simplified (image + badge + CTAs only); all catalog/banner imagery downscaled for performance
- AI studio product photography (Gemini Nano Banana): 14/21 products have ghost-mannequin studio shots on consistent grey spotlight backdrops, served from /app/frontend/public/products/. PENDING 7 (paz-10, paz-16..paz-21 incl. all 5 caps) — Emergent universal key budget exhausted mid-batch; rerun `python /app/backend/retry_images.py` after top-up, then restart backend to re-seed

## Backlog / Next Tasks
- P1: Real payment (Stripe test mode)
- P1: Customer accounts (JWT) with saved wishlist/order history
- P2: Admin panel for product CRUD
- P2: Lookbook/editorial page, campaign archive
- P2: Stock counters per size, sold-out states
- P3: Order status email via Resend, AI stylist chat, AR try-on

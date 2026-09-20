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
- Home: auto-playing slider hero (4 streetwear photoshoot slides, crossfade + Ken Burns, arrows + acid progress dots) and both campaign banners converted to 3-slide sliders; marquee strips, new drops grid, collections bento, numbered manifesto, footer newsletter
- Shop: category tabs, tag chips, search, sort, result count, sticky filter bar
- Product detail: gallery, size selector + size guide, qty, add to cart, wishlist, related items
- Cart + wishlist drawers (localStorage persisted), free-shipping progress bar
- Demo checkout: form, promo code PAZOOKA10 (10%), server-computed totals, order confirmation

## Implemented (2026-09-19)
- Backend: GET /api/products (category/q/sort/tag filters, rating summary attached), GET /api/products/{id}, GET/POST /api/products/{id}/reviews (validated 1-5), POST /api/orders (server-side pricing, promo validation, free shipping ≥$75), idempotent product + review seeds on startup
- Reviews: seeded 4-11 reviews per product (deterministic), most with customer fit-pic photos; stars + count on product cards; full reviews section on product pages (avg score card, verified-buyer list, write-a-review form with photo upload via Emergent object storage, served through /api/review-photos/)
- Auth: email/password (bcrypt + 7-day session tokens, cookie + Bearer header) and Emergent-managed Google OAuth; auth modal, OAuth callback at /account, session persisted via localStorage token + httpOnly cookie
- Account page (/account): profile header, stats, My Orders (auth-linked by user_id/email) with tracking timeline (Confirmed→Packed→Shipped→Delivered by age), Return/Exchange request flow (db.service_requests), Saved For Later (wishlist), cart shortcut; checkout prefills name/email and stamps user_id on orders
- SEO: /faq page (12 Q&As, FAQPage JSON-LD) and /blog + /blog/:slug (5 keyword-targeted articles on oversized tees India, 280 GSM, oversized vs regular fit, caps, styling; Article JSON-LD per post); index.html title/description/keywords/OG tags; footer MORE column (Blog, FAQ, My Account, Track Order)
- INR base pricing (₹799-₹1,899, India-market price points) + currency switcher in navbar (INR/USD/EUR/GBP, static display rates, persisted in browser); free shipping ≥₹2,999, flat ₹99; orders stored in INR
- Product pages: details accordion (Description/Details/Material/Returns & Refunds — 24h return window, 50-day store credit refunds, size-only exchanges) + PIN code delivery check (POST /api/delivery/check — metro 2-3 days, standard 4-6, remote 6-8 no COD) + 8-image scrollable gallery (PIL-generated flip/zoom/crop variants in /products/*-vN.jpg, imgix crop params for stock fallbacks) + colour selector (flows into cart + orders) + Best Offers box
- Frontend: all pages and components above; data-testids throughout
- Verified: all API endpoints via curl; e2e flows via screenshots (quick add, cart, product detail, checkout, order confirmation, mobile menu)
- Hero simplified (image + badge + CTAs only); all catalog/banner imagery downscaled for performance
- AI studio product photography (Gemini Nano Banana): 14/21 products have ghost-mannequin studio shots on consistent grey spotlight backdrops, served from /app/frontend/public/products/. The other 7 (paz-10, paz-16..paz-21) use model-free stock flat-lay/product shots (NO model photos anywhere in catalog). PENDING: regenerate these 7 in studio style (caps on brick cube pedestal — prompt updated in generate_product_images.py) once universal key budget is topped up: run `python /app/backend/retry_images.py`, restart backend to re-seed

## Backlog / Next Tasks
- P1: Real payment (Stripe test mode)
- P1: Customer accounts (JWT) with saved wishlist/order history
- P2: Admin panel for product CRUD
- P2: Lookbook/editorial page, campaign archive
- P2: Stock counters per size, sold-out states
- P3: Order status email via Resend, AI stylist chat, AR try-on

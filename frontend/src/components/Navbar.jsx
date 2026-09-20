import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useShop, CURRENCIES } from "../context/ShopContext";
import PromoBar from "./PromoBar";

const NAV_LINKS = [
  { label: "SHOP ALL", to: "/shop", mega: true },
  { label: "OVERSIZED", to: "/shop?category=oversized" },
  { label: "REGULAR FIT", to: "/shop?category=regular" },
  { label: "CAPS", to: "/shop?category=caps" },
];

const MEGA_FIT = [
  { label: "ALL DROPS", to: "/shop", count: "21" },
  { label: "OVERSIZED TEES", to: "/shop?category=oversized", count: "10" },
  { label: "REGULAR FIT TEES", to: "/shop?category=regular", count: "06" },
  { label: "CAPS & HEADWEAR", to: "/shop?category=caps", count: "05" },
];

const MEGA_VIBE = [
  { label: "NEW DROPS", to: "/shop?tag=NEW DROP" },
  { label: "LIMITED RUNS", to: "/shop?tag=LIMITED" },
  { label: "BESTSELLERS", to: "/shop?tag=BESTSELLER" },
  { label: "CORE ESSENTIALS", to: "/shop?tag=CORE" },
];

const MEGA_FEATURED = [
  {
    img: "/products/paz-02.png",
    label: "NEON METROPOLIS TEE",
    to: "/product/paz-02",
  },
  {
    img: "/products/paz-04.png",
    label: "TOXIC MATRIX TEE",
    to: "/product/paz-04",
  },
];

export default function Navbar() {
  const { cartCount, wishlist, setCartOpen, setWishOpen, currency, setCurrency } = useShop();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <PromoBar />
      <nav className="bg-white/90 backdrop-blur-md border-b border-zinc-200" data-testid="navbar">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              data-testid="mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors"
            >
              <Menu size={18} />
            </button>
            <Link to="/" data-testid="brand-logo" className="font-display text-3xl sm:text-4xl tracking-wide leading-none pt-1">
              PAZOOKA<span className="text-acid">.</span>
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-8" onMouseLeave={() => setMegaOpen(false)}>
            {NAV_LINKS.map((l) => (
              <li key={l.label} onMouseEnter={() => setMegaOpen(!!l.mega)}>
                <Link
                  to={l.to}
                  data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-syne font-bold text-[13px] tracking-wide hover:text-zinc-500 transition-colors flex items-center gap-1 py-6"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li onMouseEnter={() => setMegaOpen(false)}>
              <Link to="/shop?tag=LIMITED" data-testid="nav-limited" className="font-syne font-bold text-[13px] tracking-wide text-black bg-acid px-3 py-1.5 hover:bg-black hover:text-acid transition-colors">
                LIMITED
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              data-testid="currency-select"
              aria-label="Select currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border border-zinc-300 focus:border-black px-2 h-10 font-mono text-[11px] font-bold tracking-widest bg-white focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              data-testid="wishlist-drawer-trigger"
              aria-label="Open wishlist"
              onClick={() => setWishOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors"
            >
              <Heart size={17} />
              {wishlist.length > 0 && (
                <span data-testid="wishlist-count" className="absolute -top-1.5 -right-1.5 bg-acid text-black font-mono text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              data-testid="cart-drawer-trigger"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center bg-black text-white hover:bg-acid hover:text-black transition-colors"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span data-testid="cart-count" className="absolute -top-1.5 -right-1.5 bg-acid text-black font-mono text-[10px] font-bold min-w-[18px] min-h-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && (
            <motion.div
              data-testid="mega-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
              className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b-2 border-black shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
            >
              <div className="max-w-[1536px] mx-auto px-12 py-10 grid grid-cols-12 gap-10">
                <div className="col-span-3">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-5">SHOP BY FIT</p>
                  <ul className="space-y-3">
                    {MEGA_FIT.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} onClick={() => setMegaOpen(false)} data-testid={`mega-${l.label.toLowerCase().replace(/\s+/g, "-")}`} className="group flex items-baseline gap-2 font-syne font-bold text-lg uppercase hover:translate-x-1 transition-transform">
                          {l.label}
                          <span className="font-mono text-[10px] text-zinc-400">{l.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-3">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-5">BY VIBE</p>
                  <ul className="space-y-3">
                    {MEGA_VIBE.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} onClick={() => setMegaOpen(false)} className="group flex items-center gap-2 font-syne font-bold text-lg uppercase hover:translate-x-1 transition-transform">
                          {l.label}
                          <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 bg-ink text-acid font-mono text-[10px] font-bold tracking-[0.2em] px-4 py-3">
                    CODE PAZOOKA10 — 10% OFF FIRST DROP
                  </div>
                </div>
                {MEGA_FEATURED.map((f) => (
                  <Link key={f.label} to={f.to} onClick={() => setMegaOpen(false)} className="col-span-3 group relative overflow-hidden bg-zinc-100 h-56 block">
                    <img src={f.img} alt={f.label} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white font-syne font-bold text-sm uppercase flex items-center gap-1.5">
                      {f.label} <ArrowUpRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink text-white flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-800">
              <span className="font-display text-3xl pt-1">PAZOOKA<span className="text-acid">.</span></span>
              <button data-testid="mobile-menu-close" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-6 gap-2">
              {[{ label: "HOME", to: "/" }, ...NAV_LINKS, { label: "LIMITED RUNS", to: "/shop?tag=LIMITED" }].map((l, i) => (
                <motion.div key={l.label} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}>
                  <Link to={l.to} onClick={() => setMobileOpen(false)} data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`} className="font-display text-5xl sm:text-6xl leading-[1.05] hover:text-acid transition-colors flex items-center gap-3">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-6 pb-8 font-mono text-[10px] tracking-[0.25em] text-zinc-500">
              FREE SHIPPING OVER $75 // CODE PAZOOKA10
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

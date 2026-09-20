import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ChevronDown, Truck, RotateCcw, Zap, BadgePercent, Banknote, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, fetchProducts, checkPin } from "../lib/api";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import Stars from "../components/Stars";
import Reviews from "../components/Reviews";
import { Reveal } from "../components/motion";

const SIZE_GUIDE = [
  { s: "S", chest: '40"', length: '27"' },
  { s: "M", chest: '42"', length: '28"' },
  { s: "L", chest: '44"', length: '29"' },
  { s: "XL", chest: '46"', length: '30"' },
  { s: "XXL", chest: '48"', length: '31"' },
];

const pickHex = (color = "") => {
  const c = color.toLowerCase();
  if (c.includes("black") || c.includes("coal") || c.includes("midnight") || c.includes("charcoal")) return "#161616";
  if (c.includes("lime") || c.includes("acid")) return "#D4FF00";
  if (c.includes("white") || c.includes("bone") || c.includes("chalk") || c.includes("ecru")) return "#F2F0EA";
  if (c.includes("navy")) return "#2B3A55";
  return "#8E8E88";
};

const EXTRA_COLORS = [
  { name: "Triple Black", hex: "#161616" },
  { name: "Bone White", hex: "#F2F0EA" },
  { name: "Concrete Grey", hex: "#8E8E88" },
];

const buildGallery = (product) => {
  const main = product.images[0];
  if (main.startsWith("/products/")) {
    const base = main.replace(".png", "");
    return [main, ...[2, 3, 4, 5, 6, 7, 8].map((n) => `${base}-v${n}.jpg`)];
  }
  return [
    main,
    `${main}&flip=h`,
    `${main}&h=1000&crop=entropy`,
    `${main}&h=1000&crop=top`,
    `${main}&h=1000&crop=bottom`,
    `${main}&h=1000&crop=left`,
    `${main}&h=1000&crop=right`,
    `${main}&sat=-70`,
  ];
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen, formatPrice } = useShop();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [openSection, setOpenSection] = useState("DESCRIPTION");
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState(null);
  const [pinError, setPinError] = useState(null);
  const [pinChecking, setPinChecking] = useState(false);

  const checkPinCode = async () => {
    setPinError(null);
    setPinResult(null);
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setPinError("ENTER A VALID 6-DIGIT PIN CODE");
      return;
    }
    setPinChecking(true);
    try {
      setPinResult(await checkPin(pin));
    } catch (err) {
      setPinError(err?.response?.data?.detail || "COULDN'T CHECK DELIVERY");
    } finally {
      setPinChecking(false);
    }
  };
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProduct(null);
    setSize(null);
    setQty(1);
    setSelectedColor(null);
    setNotFound(false);
    setPin("");
    setPinResult(null);
    setPinError(null);
    fetchProduct(id)
      .then((p) => {
        setProduct(p);
        setSelectedColor(p.color);
        if (p.sizes.length === 1) setSize(p.sizes[0]);
        fetchProducts({ category: p.category }).then((all) =>
          setRelated(all.filter((x) => x.id !== p.id).slice(0, 4))
        );
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="py-32 text-center" data-testid="product-not-found">
        <p className="font-display text-7xl text-zinc-200">LOST IN THE STATIC.</p>
        <p className="font-mono text-xs tracking-widest text-zinc-500 mt-4">THIS PIECE DOESN'T EXIST (ANYMORE).</p>
        <Link to="/shop" className="mt-8 inline-block bg-acid text-black font-syne font-bold text-sm px-8 py-4 hover:bg-white transition-colors">
          BACK TO THE DROP
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-12 grid lg:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-zinc-100 animate-pulse" />
        <div className="space-y-4 pt-4">
          <div className="h-4 w-24 bg-zinc-100 animate-pulse" />
          <div className="h-12 w-3/4 bg-zinc-100 animate-pulse" />
          <div className="h-6 w-32 bg-zinc-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const wish = isWishlisted(product.id);
  const colorways = [
    { name: product.color, hex: pickHex(product.color) },
    ...EXTRA_COLORS.filter((c) => c.name.toLowerCase() !== (product.color || "").toLowerCase()).slice(0, 2),
  ];
  const gallery = buildGallery(product);
  const handleAdd = () => {
    if (!size) {
      toast.error("SELECT A SIZE FIRST");
      return;
    }
    addToCart(product, size, qty, selectedColor);
    setCartOpen(true);
  };

  return (
    <div data-testid="product-page">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mb-8">
          <Link to="/" className="hover:text-black">HOME</Link> / <Link to="/shop" className="hover:text-black">SHOP</Link> / <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category.toUpperCase()}</Link> / <span className="text-black">{product.id.toUpperCase()}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="grid grid-cols-2 gap-2 content-start" data-testid="product-gallery">
            {gallery.map((src, i) => (
              <div key={i} data-testid={`gallery-img-${i}`} className="group relative aspect-[3/4] overflow-hidden bg-zinc-100 border border-zinc-200">
                <img
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {i === 0 && (
                  <span className="absolute top-4 left-4 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{product.tag}</span>
                )}
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-28 self-start">
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
              {product.category === "caps" ? "HEADWEAR" : product.fit}{product.gsm ? ` // ${product.gsm}` : ""} // {product.color}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl leading-[0.95] mt-3" data-testid="product-name">{product.name}</h1>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-mono text-2xl font-bold" data-testid="product-price">{formatPrice(product.price)}</span>
              {product.original_price && (
                <>
                  <span className="font-mono text-base text-zinc-400 line-through">{formatPrice(product.original_price)}</span>
                  <span className="bg-acid font-mono text-[10px] font-bold px-2 py-0.5">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </span>
                </>
              )}
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed mt-6 max-w-md">{product.description}</p>

            {product.rating && product.rating.count > 0 && (
              <a href="#reviews" data-testid="pdp-rating-link" className="flex items-center gap-2 mt-4 w-fit group">
                <Stars value={product.rating.avg} size={14} />
                <span className="font-mono text-xs font-bold">{product.rating.avg.toFixed(1)}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 group-hover:text-black transition-colors">
                  // {product.rating.count} REVIEWS
                </span>
              </a>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2.5">
                <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500">SELECT SIZE</p>
                {product.sizes.length > 1 && (
                  <button data-testid="size-guide-toggle" onClick={() => setGuideOpen(!guideOpen)} className="font-mono text-[10px] tracking-[0.2em] underline underline-offset-4 hover:text-zinc-500 flex items-center gap-1">
                    SIZE GUIDE <ChevronDown size={11} className={`transition-transform ${guideOpen ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {guideOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <table className="w-full font-mono text-[11px] mb-4 border border-zinc-200" data-testid="size-guide-table">
                      <thead>
                        <tr className="bg-zinc-50">
                          <th className="text-left px-3 py-2 font-bold">SIZE</th>
                          <th className="text-left px-3 py-2 font-bold">CHEST</th>
                          <th className="text-left px-3 py-2 font-bold">LENGTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_GUIDE.map((r) => (
                          <tr key={r.s} className="border-t border-zinc-200">
                            <td className="px-3 py-2 font-bold">{r.s}</td>
                            <td className="px-3 py-2">{r.chest}</td>
                            <td className="px-3 py-2">{r.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-1.5 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    data-testid={`size-btn-${s.toLowerCase()}`}
                    onClick={() => setSize(s)}
                    className={`min-w-12 h-12 px-3 border font-mono text-sm transition-all ${size === s ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_#D4FF00]" : "border-zinc-300 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-2.5">
                COLOUR — <span className="text-black font-bold uppercase">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5">
                {colorways.map((c) => (
                  <button
                    key={c.name}
                    data-testid={`color-${c.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={c.name}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-10 h-10 border-2 transition-all ${selectedColor === c.name ? "border-black shadow-[3px_3px_0px_0px_#D4FF00]" : "border-zinc-300 hover:border-black"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <div className="flex items-center border border-zinc-300">
                <button data-testid="qty-minus" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-zinc-100"><Minus size={14} /></button>
                <span className="w-10 text-center font-mono text-sm font-bold" data-testid="qty-value">{qty}</span>
                <button data-testid="qty-plus" aria-label="Increase quantity" onClick={() => setQty(Math.min(10, qty + 1))} className="w-12 h-12 flex items-center justify-center hover:bg-zinc-100"><Plus size={14} /></button>
              </div>
              <button
                data-testid="add-to-cart-btn"
                onClick={handleAdd}
                className="flex-1 bg-acid text-black font-syne font-bold text-sm tracking-wide hover:bg-white transition-colors"
              >
                ADD TO CART — {formatPrice(product.price * qty)}
              </button>
              <button
                data-testid="wishlist-toggle"
                aria-label="Toggle wishlist"
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 flex items-center justify-center border-2 transition-colors ${wish ? "bg-acid border-acid text-black" : "border-black hover:bg-black hover:text-white"}`}
              >
                <Heart size={17} fill={wish ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-6 border border-zinc-200 p-4" data-testid="best-offers">
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mb-3">BEST OFFERS</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm">
                  <BadgePercent size={16} className="shrink-0 mt-0.5" />
                  <span><span className="bg-acid font-mono text-[10px] font-bold px-1.5 py-0.5 mr-2">PAZOOKA10</span>Flat 10% off on your first order</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <Truck size={16} className="shrink-0 mt-0.5" />
                  <span>Free shipping on all orders over ₹2,999</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <Banknote size={16} className="shrink-0 mt-0.5" />
                  <span>COD available on eligible PIN codes</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <RefreshCcw size={16} className="shrink-0 mt-0.5" />
                  <span>Size exchanges accepted within 24 hours of delivery</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 border border-zinc-200 p-4" data-testid="pin-check">
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mb-3">DELIVERY CHECK</p>
              <div className="flex gap-2">
                <input
                  data-testid="pin-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && checkPinCode()}
                  placeholder="ENTER PIN CODE"
                  inputMode="numeric"
                  className="flex-1 border border-zinc-300 focus:border-black px-4 py-3 font-mono text-xs tracking-[0.2em] focus:outline-none transition-colors"
                />
                <button
                  data-testid="pin-check-btn"
                  onClick={checkPinCode}
                  disabled={pinChecking}
                  className="bg-black text-white font-mono text-[10px] font-bold tracking-[0.2em] px-5 hover:bg-acid hover:text-black transition-colors disabled:opacity-50"
                >
                  {pinChecking ? "..." : "CHECK"}
                </button>
              </div>
              {pinError && (
                <p data-testid="pin-error" className="font-mono text-[11px] tracking-widest text-[#FF3B30] mt-3">{pinError}</p>
              )}
              {pinResult && (
                <div data-testid="pin-result" className="mt-3 bg-ink text-white p-4">
                  <p className="font-syne font-bold text-sm">
                    DELIVERING TO {pinResult.pin}{pinResult.zone ? ` — ${pinResult.zone}` : ""}
                  </p>
                  <p className="font-mono text-[11px] tracking-widest text-acid mt-1.5">ESTIMATED {pinResult.eta}</p>
                  <p className="font-mono text-[10px] tracking-widest text-zinc-400 mt-1">
                    {pinResult.cod_available ? "COD AVAILABLE // FREE SHIPPING OVER ₹2,999" : "PREPAID ONLY // FREE SHIPPING OVER ₹2,999"}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mt-8">
              {[
                { icon: Truck, t: "FREE SHIPPING ₹2,999+" },
                { icon: RotateCcw, t: "24H RETURN WINDOW" },
                { icon: Zap, t: "SHIPS IN 48H" },
              ].map((f) => (
                <div key={f.t} className="bg-white px-3 py-4 flex flex-col items-center gap-2 text-center">
                  <f.icon size={16} />
                  <span className="font-mono text-[9px] tracking-[0.15em] text-zinc-600">{f.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 pb-14 sm:pb-20" data-testid="product-details-accordion">
        <div className="border-t-2 border-black">
          {["DESCRIPTION", "DETAILS", "MATERIAL", "RETURNS & REFUNDS"].map((section) => (
            <div key={section} className="border-b border-zinc-200">
              <button
                data-testid={`accordion-${section.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                onClick={() => setOpenSection(openSection === section ? null : section)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="font-syne font-bold text-sm tracking-wide group-hover:text-zinc-500 transition-colors">{section}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openSection === section ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openSection === section && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 max-w-2xl">
                      {section === "DESCRIPTION" && (
                        <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
                      )}
                      {section === "DETAILS" && (
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-5 font-mono text-xs">
                          {[["FIT", product.fit], ["FABRIC", product.gsm || "STRUCTURED"], ["COLOR", product.color], ["SIZES", product.sizes.join(" / ")], ["SKU", product.id.toUpperCase()], ["DROP", "VOL.04"]].map(([k, v]) => (
                            <div key={k}>
                              <dt className="text-zinc-400 tracking-[0.2em]">{k}</dt>
                              <dd className="font-bold mt-1.5 uppercase">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {section === "MATERIAL" && (
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {product.category === "caps"
                            ? "Structured 100% cotton twill crown with embroidered eyelets and a pre-curved brim. Adjustable closure for a custom fit. Spot clean only — never machine wash."
                            : `100% heavyweight combed cotton, ${product.gsm}. Pre-shrunk, garment-dyed and bio-washed for zero pilling. Ribbed crew collar with double-needle hems. Machine wash cold, inside out.`}
                        </p>
                      )}
                      {section === "RETURNS & REFUNDS" && (
                        <div className="space-y-4 text-sm leading-relaxed">
                          <div>
                            <p className="font-syne font-bold text-xs tracking-wide mb-1">RETURNS</p>
                            <p className="text-zinc-600">Accepted only for defective, damaged, incorrect, or undelivered products. Must be requested within 24 hours.</p>
                          </div>
                          <div>
                            <p className="font-syne font-bold text-xs tracking-wide mb-1">REFUNDS</p>
                            <p className="text-zinc-600">Approved returns get a store credit coupon code (valid 50 days).</p>
                          </div>
                          <div>
                            <p className="font-syne font-bold text-xs tracking-wide mb-1">EXCHANGES</p>
                            <p className="text-zinc-600">Exchanges are strictly allowed only for size-related issues. Product exchanges are not permitted under any circumstances.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <Reviews productId={product.id} />

      {related.length > 0 && (
        <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20" data-testid="related-section">
          <Reveal><h2 className="font-display text-5xl sm:text-6xl leading-[0.85] mb-8">COMPLETE THE FIT</h2></Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

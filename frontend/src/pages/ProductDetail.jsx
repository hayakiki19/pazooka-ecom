import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ChevronDown, Truck, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, fetchProducts } from "../lib/api";
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

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen, formatPrice } = useShop();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProduct(null);
    setSize(null);
    setQty(1);
    setImgIdx(0);
    setNotFound(false);
    fetchProduct(id)
      .then((p) => {
        setProduct(p);
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
  const handleAdd = () => {
    if (!size) {
      toast.error("SELECT A SIZE FIRST");
      return;
    }
    addToCart(product, size, qty);
    setCartOpen(true);
  };

  return (
    <div data-testid="product-page">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mb-8">
          <Link to="/" className="hover:text-black">HOME</Link> / <Link to="/shop" className="hover:text-black">SHOP</Link> / <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category.toUpperCase()}</Link> / <span className="text-black">{product.id.toUpperCase()}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <div>
            <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden border border-zinc-200">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={product.images[imgIdx]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <span className="absolute top-4 left-4 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{product.tag}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  data-testid={`thumb-${i}`}
                  onClick={() => setImgIdx(i)}
                  className={`relative w-20 aspect-[3/4] overflow-hidden border-2 transition-colors ${imgIdx === i ? "border-black" : "border-transparent hover:border-zinc-400"}`}
                >
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
              {product.category === "caps" ? "HEADWEAR" : product.fit}{product.gsm ? ` // ${product.gsm}` : ""} // {product.color}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[0.88] mt-3" data-testid="product-name">{product.name}</h1>
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

            <div className="grid grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mt-8">
              {[
                { icon: Truck, t: "FREE SHIPPING ₹2,999+" },
                { icon: RotateCcw, t: "30-DAY RETURNS" },
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

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useShop } from "../context/ShopContext";

export default function QuickView() {
  const { quickView, setQuickView, addToCart, setCartOpen } = useShop();
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (quickView) setSize(quickView.sizes.length === 1 ? quickView.sizes[0] : null);
  }, [quickView]);

  const handleAdd = () => {
    if (!size) {
      toast.error("SELECT A SIZE FIRST");
      return;
    }
    addToCart(quickView, size);
    setQuickView(null);
    setCartOpen(true);
  };

  return (
    <AnimatePresence>
      {quickView && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickView(null)}
            className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            data-testid="quick-view-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[80] inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-0 sm:mx-auto max-w-3xl bg-white border-2 border-black grid sm:grid-cols-2 max-h-[85vh] overflow-y-auto"
          >
            <div className="relative aspect-[3/4] sm:aspect-auto bg-zinc-100">
              <img src={quickView.images[0]} alt={quickView.name} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute top-3 left-3 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{quickView.tag}</span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col">
              <button data-testid="quick-view-close" aria-label="Close quick view" onClick={() => setQuickView(null)} className="self-end w-9 h-9 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors -mt-2 -mr-2">
                <X size={16} />
              </button>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">{quickView.fit}{quickView.gsm ? ` // ${quickView.gsm}` : ""}</p>
              <h3 className="font-display text-3xl sm:text-4xl leading-none mt-2">{quickView.name}</h3>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="font-mono text-xl font-bold">${quickView.price}</span>
                {quickView.original_price && <span className="font-mono text-sm text-zinc-400 line-through">${quickView.original_price}</span>}
              </div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mt-6 mb-2">SIZE</p>
              <div className="flex gap-1.5 flex-wrap">
                {quickView.sizes.map((s) => (
                  <button
                    key={s}
                    data-testid={`qv-size-${s}`}
                    onClick={() => setSize(s)}
                    className={`min-w-10 h-10 px-2 border font-mono text-xs transition-colors ${size === s ? "bg-black text-white border-black" : "border-zinc-300 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button data-testid="qv-add-to-cart" onClick={handleAdd} className="mt-6 w-full bg-black text-white font-syne font-bold text-sm py-4 hover:bg-acid hover:text-black transition-colors">
                ADD TO CART
              </button>
              <Link to={`/product/${quickView.id}`} onClick={() => setQuickView(null)} data-testid="qv-full-details" className="mt-3 font-mono text-[11px] tracking-[0.2em] text-zinc-600 hover:text-black flex items-center gap-1.5 transition-colors">
                FULL DETAILS <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

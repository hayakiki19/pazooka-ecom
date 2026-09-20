import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function WishlistDrawer() {
  const { wishlist, wishOpen, setWishOpen, toggleWishlist, addToCart, setCartOpen, formatPrice } = useShop();

  return (
    <AnimatePresence>
      {wishOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            data-testid="wishlist-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-white flex flex-col border-l-2 border-black"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200">
              <h2 className="font-display text-2xl pt-1">WISHLIST <span className="text-zinc-400">({wishlist.length})</span></h2>
              <button data-testid="wishlist-close-btn" aria-label="Close wishlist" onClick={() => setWishOpen(false)} className="w-9 h-9 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {wishlist.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4" data-testid="wishlist-empty">
                  <p className="font-display text-4xl text-zinc-300">NOTHING SAVED.</p>
                  <p className="font-mono text-xs text-zinc-500 tracking-widest">TAP THE HEART ON ANY PIECE.</p>
                </div>
              )}
              {wishlist.map((item) => (
                <div key={item.id} data-testid={`wishlist-item-${item.id}`} className="flex gap-3 border border-zinc-200 p-3">
                  <Link to={`/product/${item.id}`} onClick={() => setWishOpen(false)}>
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-zinc-100" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="font-syne font-bold text-xs uppercase leading-tight">{item.name}</p>
                    <span className="font-mono text-sm font-bold mt-1.5">{formatPrice(item.price)}</span>
                    <button
                      data-testid={`wishlist-add-cart-${item.id}`}
                      onClick={() => { addToCart(item); setWishOpen(false); setCartOpen(true); }}
                      className="mt-auto self-start flex items-center gap-2 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-3 py-2 hover:bg-white transition-colors"
                    >
                      <ShoppingBag size={12} /> ADD TO CART
                    </button>
                  </div>
                  <button data-testid={`wishlist-remove-${item.id}`} aria-label="Remove" onClick={() => toggleWishlist(item)} className="self-start text-zinc-400 hover:text-[#FF3B30] transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

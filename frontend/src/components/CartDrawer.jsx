import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartTotal, cartCount, formatPrice } = useShop();
  const navigate = useNavigate();
  const progress = Math.min(cartTotal / 2999, 1);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            data-testid="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            data-testid="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-white flex flex-col border-l-2 border-black"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200">
              <h2 className="font-display text-2xl pt-1">YOUR CART <span className="text-zinc-400">({cartCount})</span></h2>
              <button data-testid="cart-close-btn" aria-label="Close cart" onClick={() => setCartOpen(false)} className="w-9 h-9 flex items-center justify-center border border-zinc-300 hover:border-black transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50">
              <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600 mb-2">
                {cartTotal >= 2999 ? "FREE SHIPPING UNLOCKED" : `${formatPrice(2999 - cartTotal)} AWAY FROM FREE SHIPPING`}
              </p>
              <div className="h-1.5 bg-zinc-200 w-full">
                <div className="h-full bg-acid transition-all duration-500" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4" data-testid="cart-empty">
                  <p className="font-display text-4xl text-zinc-300">CART'S EMPTY.</p>
                  <p className="font-mono text-xs text-zinc-500 tracking-widest">FIX THAT. THE DROP WON'T WAIT.</p>
                  <button onClick={() => { setCartOpen(false); navigate("/shop"); }} data-testid="cart-shop-now-btn" className="mt-2 bg-acid text-black font-syne font-bold text-sm px-6 py-3 hover:bg-white transition-colors">
                    SHOP NEW DROPS
                  </button>
                </div>
              )}
              {cart.map((item) => (
                <div key={item.key} data-testid={`cart-item-${item.key}`} className="flex gap-3 border border-zinc-200 p-3">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-zinc-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-bold text-xs uppercase leading-tight">{item.name}</p>
                    <p className="font-mono text-[10px] text-zinc-500 tracking-widest mt-1">SIZE {item.size}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-zinc-300">
                        <button data-testid={`cart-minus-${item.key}`} aria-label="Decrease" onClick={() => updateQty(item.key, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100"><Minus size={12} /></button>
                        <span className="w-7 text-center font-mono text-xs">{item.qty}</span>
                        <button data-testid={`cart-plus-${item.key}`} aria-label="Increase" onClick={() => updateQty(item.key, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100"><Plus size={12} /></button>
                      </div>
                      <span className="font-mono text-sm font-bold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button data-testid={`cart-remove-${item.key}`} aria-label="Remove" onClick={() => removeFromCart(item.key)} className="self-start text-zinc-400 hover:text-[#FF3B30] transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="border-t-2 border-black px-5 py-4 space-y-3">
                <div className="flex justify-between font-mono text-sm">
                  <span className="tracking-widest text-zinc-500">SUBTOTAL</span>
                  <span data-testid="cart-subtotal" className="font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  data-testid="checkout-btn"
                  onClick={() => { setCartOpen(false); navigate("/checkout"); }}
                  className="w-full bg-acid text-black font-syne font-bold text-sm py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  CHECKOUT <ArrowRight size={16} />
                </button>
                <p className="font-mono text-[9px] tracking-[0.2em] text-zinc-400 text-center">DEMO CHECKOUT — NO REAL PAYMENT</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

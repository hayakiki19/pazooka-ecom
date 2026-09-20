import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "../lib/api";
import { useShop } from "../context/ShopContext";
import { Reveal } from "../components/motion";

const inputCls =
  "w-full border border-zinc-300 focus:border-black px-4 py-3.5 text-sm focus:outline-none transition-colors bg-white";

export default function Checkout() {
  const { cart, cartTotal, clearCart, formatPrice } = useShop();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "" });
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  const discount = appliedPromo ? cartTotal * 0.1 : 0;
  const shipping = cart.length === 0 || cartTotal - discount >= 2999 ? 0 : 99;
  const total = Math.max(0, cartTotal - discount + shipping);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "PAZOOKA10") {
      setAppliedPromo("PAZOOKA10");
      toast.success("PROMO APPLIED", { description: "10% off your order" });
    } else {
      toast.error("INVALID CODE");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const payload = {
        items: cart.map((i) => ({ product_id: i.id, size: i.size, qty: i.qty })),
        customer: form,
        promo_code: appliedPromo,
      };
      const o = await createOrder(payload);
      setOrder(o);
      clearCart();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "CHECKOUT FAILED — TRY AGAIN");
    } finally {
      setPlacing(false);
    }
  };

  if (order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24" data-testid="order-confirmation">
        <Reveal y={24}>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 bg-acid flex items-center justify-center"><Check size={22} strokeWidth={3} /></span>
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500">ORDER CONFIRMED</p>
          </div>
          <h1 className="font-display text-6xl sm:text-8xl leading-[0.85]">
            YOU'RE IN.<br /><span className="text-stroke-black">IT'S YOURS.</span>
          </h1>
          <div className="mt-8 inline-block bg-ink text-acid font-mono font-bold text-lg tracking-[0.2em] px-6 py-4" data-testid="order-number">
            {order.order_number}
          </div>
          <p className="text-zinc-600 text-sm mt-6 max-w-md">
            Confirmation sent to <span className="font-bold text-black">{order.customer.email}</span>.
            Your pieces ship within 48 hours. This was a demo checkout — no real payment was taken.
          </p>
          <div className="border border-zinc-200 mt-10 divide-y divide-zinc-200">
            {order.items.map((i) => (
              <div key={`${i.product_id}-${i.size}`} className="flex items-center gap-4 p-4">
                <img src={i.image} alt={i.name} className="w-14 h-16 object-cover bg-zinc-100" />
                <div className="flex-1">
                  <p className="font-syne font-bold text-xs uppercase">{i.name}</p>
                  <p className="font-mono text-[10px] text-zinc-500 tracking-widest mt-0.5">SIZE {i.size} × {i.qty}</p>
                </div>
                <span className="font-mono text-sm font-bold">{formatPrice(i.line_total)}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-sm mt-6 space-y-1.5">
            <div className="flex justify-between text-zinc-500"><span>SUBTOTAL</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-zinc-500"><span>DISCOUNT ({order.promo_code})</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between text-zinc-500"><span>SHIPPING</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-200"><span>TOTAL</span><span data-testid="order-total">{formatPrice(order.total)}</span></div>
          </div>
          <Link to="/shop" data-testid="continue-shopping-btn" className="group mt-10 inline-flex items-center gap-3 bg-acid text-black font-syne font-bold text-sm px-8 py-4 hover:bg-white transition-colors">
            CONTINUE SHOPPING <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-32 text-center" data-testid="checkout-empty">
        <p className="font-display text-7xl text-zinc-200">CART'S EMPTY.</p>
        <p className="font-mono text-xs tracking-widest text-zinc-500 mt-4">NOTHING TO CHECK OUT. YET.</p>
        <Link to="/shop" className="mt-8 inline-block bg-acid text-black font-syne font-bold text-sm px-8 py-4 hover:bg-white transition-colors">
          SHOP NEW DROPS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16" data-testid="checkout-page">
      <Link to="/shop" className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 hover:text-black flex items-center gap-2 mb-6 w-fit">
        <ArrowLeft size={12} /> BACK TO SHOP
      </Link>
      <h1 className="font-display text-6xl sm:text-8xl leading-[0.85] mb-10">CHECKOUT</h1>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">01 // CONTACT</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input data-testid="checkout-name" required value={form.name} onChange={set("name")} placeholder="FULL NAME" className={inputCls} />
              <input data-testid="checkout-email" required type="email" value={form.email} onChange={set("email")} placeholder="EMAIL" className={inputCls} />
              <input data-testid="checkout-phone" required value={form.phone} onChange={set("phone")} placeholder="PHONE" className={`${inputCls} sm:col-span-2`} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">02 // SHIPPING</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input data-testid="checkout-address" required value={form.address} onChange={set("address")} placeholder="STREET ADDRESS" className={`${inputCls} sm:col-span-2`} />
              <input data-testid="checkout-city" required value={form.city} onChange={set("city")} placeholder="CITY" className={inputCls} />
              <input data-testid="checkout-zip" required value={form.zip} onChange={set("zip")} placeholder="ZIP / POSTCODE" className={inputCls} />
            </div>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-400">DEMO CHECKOUT — NO PAYMENT DETAILS NEEDED, NO REAL CHARGE.</p>
        </div>

        <div className="lg:col-span-2">
          <div className="border-2 border-black p-6 sticky top-32">
            <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-5">ORDER SUMMARY</p>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cart.map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <img src={i.image} alt={i.name} className="w-12 h-14 object-cover bg-zinc-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-bold text-[11px] uppercase leading-tight truncate">{i.name}</p>
                    <p className="font-mono text-[9px] text-zinc-500 tracking-widest mt-0.5">{i.size} × {i.qty}</p>
                  </div>
                  <span className="font-mono text-xs font-bold">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <input
                data-testid="promo-input"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="PROMO CODE"
                className="flex-1 border border-zinc-300 focus:border-black px-3 py-2.5 font-mono text-[11px] tracking-widest focus:outline-none transition-colors"
              />
              <button type="button" data-testid="promo-apply-btn" onClick={applyPromo} className="bg-black text-white font-mono text-[10px] font-bold tracking-widest px-4 hover:bg-acid hover:text-black transition-colors">
                APPLY
              </button>
            </div>

            <div className="font-mono text-xs mt-6 space-y-2">
              <div className="flex justify-between text-zinc-500"><span>SUBTOTAL</span><span>{formatPrice(cartTotal)}</span></div>
              {appliedPromo && <div className="flex justify-between text-zinc-500"><span>PAZOOKA10 (-10%)</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-zinc-500"><span>SHIPPING</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base pt-3 border-t-2 border-black"><span>TOTAL</span><span data-testid="checkout-total">{formatPrice(total)}</span></div>
            </div>

            <button
              data-testid="place-order-btn"
              type="submit"
              disabled={placing}
              className="mt-6 w-full bg-acid text-black font-syne font-extrabold text-sm tracking-wide py-4 hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {placing ? "PLACING ORDER..." : "PLACE ORDER"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

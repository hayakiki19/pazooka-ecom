import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, ShoppingBag, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { fetchMyOrders, fetchMyRequests, createServiceRequest } from "../lib/api";
import { Reveal } from "../components/motion";

const STAGES = ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

const stageFor = (created) => {
  const hours = (Date.now() - new Date(created).getTime()) / 36e5;
  if (hours < 6) return 0;
  if (hours < 24) return 1;
  if (hours < 72) return 2;
  return 3;
};

export default function Account() {
  const { user, loading, logout, setAuthModalOpen } = useAuth();
  const { wishlist, cart, setCartOpen, setWishOpen, addToCart, formatPrice } = useShop();
  const [orders, setOrders] = useState(null);
  const [requests, setRequests] = useState([]);
  const [trackOpen, setTrackOpen] = useState(null);
  const [reqForm, setReqForm] = useState(null);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMyOrders().then(setOrders).catch(() => setOrders([]));
    fetchMyRequests().then(setRequests).catch(() => setRequests([]));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display text-4xl animate-pulse">LOADING...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4" data-testid="account-signin-prompt">
        <p className="font-mono text-[10px] tracking-[0.35em] text-zinc-500 mb-4">MEMBERS ONLY</p>
        <h1 className="font-display text-6xl sm:text-8xl leading-[0.85]">SIGN IN TO<br />YOUR ACCOUNT</h1>
        <p className="text-zinc-600 text-sm mt-6 max-w-sm">
          Track orders, request returns & exchanges, and keep your saved pieces in one place.
        </p>
        <button
          data-testid="account-signin-btn"
          onClick={() => setAuthModalOpen(true)}
          className="mt-8 bg-black text-white font-syne font-bold text-sm px-10 py-4 hover:bg-acid hover:text-black transition-colors"
        >
          SIGN IN / CREATE ACCOUNT
        </button>
      </div>
    );
  }

  const submitRequest = async () => {
    if (!reason.trim()) {
      toast.error("ADD A REASON");
      return;
    }
    setSending(true);
    try {
      const r = await createServiceRequest({ ...reqForm, reason });
      setRequests([r, ...requests]);
      setReqForm(null);
      setReason("");
      toast.success(`${reqForm.type === "return" ? "RETURN" : "EXCHANGE"} REQUESTED`, {
        description: `${r.request_id} — we'll email you within 24h`,
      });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "REQUEST FAILED");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-16" data-testid="account-page">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b-2 border-black">
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img src={user.picture} alt="" className="w-14 h-14 object-cover border-2 border-black" />
          ) : (
            <span className="w-14 h-14 bg-acid border-2 border-black flex items-center justify-center font-display text-2xl pt-1">
              {(user.name || "P")[0].toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl leading-none" data-testid="account-name">
              HEY, {(user.name || "").split(" ")[0].toUpperCase()}
            </h1>
            <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mt-1.5">{user.email}</p>
          </div>
        </div>
        <button
          data-testid="logout-btn"
          onClick={logout}
          className="flex items-center gap-2 border border-zinc-300 hover:border-black font-mono text-[10px] font-bold tracking-[0.2em] px-4 py-2.5 transition-colors"
        >
          <LogOut size={13} /> SIGN OUT
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-8">
        {[
          { icon: Package, label: "ORDERS", value: orders?.length ?? "—", testId: "stat-orders" },
          { icon: Heart, label: "SAVED", value: wishlist.length, action: () => setWishOpen(true), testId: "stat-saved" },
          { icon: ShoppingBag, label: "IN CART", value: cart.reduce((a, i) => a + i.qty, 0), action: () => setCartOpen(true), testId: "stat-cart" },
        ].map((c) => (
          <button
            key={c.label}
            data-testid={c.testId}
            onClick={c.action}
            disabled={!c.action}
            className="border border-zinc-200 p-4 sm:p-6 text-left hover:border-black transition-colors disabled:cursor-default"
          >
            <c.icon size={18} />
            <p className="font-display text-3xl sm:text-4xl mt-3">{c.value}</p>
            <p className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 mt-1">{c.label}</p>
          </button>
        ))}
      </div>

      <section className="mt-14" data-testid="orders-section">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-4xl sm:text-5xl leading-none">MY ORDERS</h2>
          <Link to="/shop" className="font-mono text-[10px] font-bold tracking-[0.2em] border-b-2 border-black pb-0.5 hover:text-zinc-500 transition-colors">
            SHOP MORE →
          </Link>
        </div>

        {orders === null ? (
          <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-28 bg-zinc-100 animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="border border-dashed border-zinc-300 py-14 text-center" data-testid="orders-empty">
            <p className="font-display text-4xl text-zinc-300">NO ORDERS YET.</p>
            <Link to="/shop" className="mt-5 inline-block bg-black text-white font-syne font-bold text-sm px-8 py-3.5 hover:bg-acid hover:text-black transition-colors">
              START YOUR FIRST DROP
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const stage = stageFor(o.created_at);
              const existingReqs = requests.filter((r) => r.order_number === o.order_number);
              return (
                <div key={o.order_number} data-testid={`order-${o.order_number}`} className="border border-zinc-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-zinc-200 bg-zinc-50">
                    <div>
                      <p className="font-syne font-bold text-sm">{o.order_number}</p>
                      <p className="font-mono text-[10px] tracking-widest text-zinc-500 mt-0.5">
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 ${stage === 3 ? "bg-acid text-black" : "bg-black text-acid"}`}>
                        {STAGES[stage]}
                      </span>
                      <span className="font-mono text-sm font-bold">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap gap-3">
                      {o.items.map((i) => (
                        <div key={`${i.product_id}-${i.size}-${i.color || ""}`} className="flex items-center gap-2.5 border border-zinc-200 pr-3">
                          <img src={i.image} alt={i.name} className="w-12 h-14 object-cover bg-zinc-100" />
                          <div>
                            <p className="font-syne font-bold text-[11px] uppercase leading-tight max-w-[180px] truncate">{i.name}</p>
                            <p className="font-mono text-[9px] text-zinc-500 tracking-widest mt-0.5">
                              {i.size}{i.color ? ` // ${i.color.toUpperCase()}` : ""} × {i.qty}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {trackOpen === o.order_number && (
                      <div className="flex items-start mt-6" data-testid={`track-${o.order_number}`}>
                        {STAGES.map((s, i) => (
                          <div key={s} className={`flex items-start ${i < STAGES.length - 1 ? "flex-1" : ""}`}>
                            <div className="flex flex-col items-center">
                              <span className={`w-3.5 h-3.5 border-2 border-black ${i <= stage ? "bg-acid" : "bg-white opacity-40"}`} />
                              <span className={`font-mono text-[8px] sm:text-[9px] tracking-widest mt-1.5 ${i <= stage ? "font-bold" : "text-zinc-400"}`}>{s}</span>
                            </div>
                            {i < STAGES.length - 1 && <div className={`h-0.5 flex-1 mx-1 mt-1.5 ${i < stage ? "bg-acid" : "bg-zinc-200"}`} />}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-5">
                      <button
                        data-testid={`track-btn-${o.order_number}`}
                        onClick={() => setTrackOpen(trackOpen === o.order_number ? null : o.order_number)}
                        className="border border-black font-mono text-[10px] font-bold tracking-[0.2em] px-4 py-2.5 hover:bg-black hover:text-acid transition-colors"
                      >
                        {trackOpen === o.order_number ? "HIDE TRACKING" : "TRACK ORDER"}
                      </button>
                      <button
                        data-testid={`return-btn-${o.order_number}`}
                        onClick={() => { setReqForm({ order_number: o.order_number, type: "return" }); setReason(""); }}
                        className="border border-zinc-300 font-mono text-[10px] font-bold tracking-[0.2em] px-4 py-2.5 hover:border-black transition-colors"
                      >
                        RETURN
                      </button>
                      <button
                        data-testid={`exchange-btn-${o.order_number}`}
                        onClick={() => { setReqForm({ order_number: o.order_number, type: "exchange" }); setReason(""); }}
                        className="border border-zinc-300 font-mono text-[10px] font-bold tracking-[0.2em] px-4 py-2.5 hover:border-black transition-colors"
                      >
                        EXCHANGE
                      </button>
                      {existingReqs.map((r) => (
                        <span key={r.request_id} className="bg-acid font-mono text-[9px] font-bold tracking-widest px-2 py-1.5">
                          {r.type.toUpperCase()} {r.status.toUpperCase()} // {r.request_id}
                        </span>
                      ))}
                    </div>

                    {reqForm?.order_number === o.order_number && (
                      <div className="mt-4 border-2 border-black p-4" data-testid="request-form">
                        <p className="font-syne font-bold text-xs uppercase mb-2">
                          {reqForm.type} REQUEST — {o.order_number}
                        </p>
                        <textarea
                          data-testid="request-reason"
                          rows={2}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="TELL US WHAT HAPPENED (SIZE ISSUE / DEFECT / WRONG ITEM...)"
                          className="w-full border border-zinc-300 focus:border-black px-3 py-2.5 text-sm focus:outline-none resize-none transition-colors"
                        />
                        <p className="font-mono text-[9px] text-zinc-500 tracking-widest mt-2">
                          RETURNS: DEFECTIVE / DAMAGED / WRONG / UNDELIVERED ONLY, WITHIN 24H. REFUNDS AS 50-DAY STORE CREDIT. EXCHANGES: SIZE ONLY.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            data-testid="request-submit"
                            onClick={submitRequest}
                            disabled={sending}
                            className="bg-black text-white font-mono text-[10px] font-bold tracking-[0.2em] px-5 py-2.5 hover:bg-acid hover:text-black transition-colors disabled:opacity-50"
                          >
                            {sending ? "SENDING..." : "SUBMIT"}
                          </button>
                          <button onClick={() => setReqForm(null)} className="font-mono text-[10px] tracking-[0.2em] px-4 py-2.5 border border-zinc-300 hover:border-black transition-colors">
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-14" data-testid="saved-section">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-4xl sm:text-5xl leading-none">SAVED FOR LATER</h2>
          <button onClick={() => setWishOpen(true)} className="font-mono text-[10px] font-bold tracking-[0.2em] border-b-2 border-black pb-0.5 hover:text-zinc-500 transition-colors">
            OPEN WISHLIST →
          </button>
        </div>
        {wishlist.length === 0 ? (
          <div className="border border-dashed border-zinc-300 py-14 text-center" data-testid="saved-empty">
            <p className="font-display text-4xl text-zinc-300">NOTHING SAVED.</p>
            <p className="font-mono text-xs text-zinc-500 tracking-widest mt-3">TAP THE HEART ON ANY PIECE.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border border-zinc-200 p-3">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-zinc-100" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-syne font-bold text-xs uppercase leading-tight truncate">{item.name}</p>
                  <p className="font-mono text-sm font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
                <button
                  data-testid={`saved-add-${item.id}`}
                  onClick={() => addToCart(item)}
                  className="bg-black text-white font-mono text-[9px] font-bold tracking-widest px-3.5 py-2.5 hover:bg-acid hover:text-black transition-colors shrink-0"
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

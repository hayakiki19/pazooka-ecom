import { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import { Toaster, toast } from "sonner";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import QuickView from "@/components/QuickView";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import { exchangeSession } from "@/lib/api";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, search]);
  return null;
}

function AuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const sessionId = location.hash.split("session_id=")[1]?.split("&")[0];
    exchangeSession(sessionId)
      .then((data) => {
        localStorage.setItem("pazooka_token", data.session_token);
        setUser(data);
        navigate("/account", { replace: true, state: { user: data } });
      })
      .catch(() => {
        toast.error("SIGN-IN FAILED — TRY AGAIN");
        navigate("/", { replace: true });
      });
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" data-testid="auth-callback">
      <p className="font-display text-4xl">SIGNING YOU IN...</p>
      <p className="font-mono text-xs tracking-[0.25em] text-zinc-500">HOLD TIGHT</p>
    </div>
  );
}

function AppRouter() {
  const location = useLocation();
  // fragment read via useLocation (reactive) — window.location.hash breaks the callback after replaceState
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "PAZOOKA — Heavyweight Streetwear";
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <ShopProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0A0A0A",
                color: "#fff",
                border: "1px solid #27272A",
                borderRadius: 0,
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
              },
            }}
          />
          <div className="min-h-screen bg-white text-ink">
            <Navbar />
            <CartDrawer />
            <WishlistDrawer />
            <QuickView />
            <AuthModal />
            <main>
              <AppRouter />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ShopProvider>
  );
}

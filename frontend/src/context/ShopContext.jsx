import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export const CURRENCIES = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 0.0112, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.0104, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.0089, locale: "en-GB" },
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load("pazooka_cart_v2"));
  const [wishlist, setWishlist] = useState(() => load("pazooka_wishlist_v2"));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [currency, setCurrency] = useState(() => localStorage.getItem("pazooka_currency") || "INR");

  useEffect(() => {
    localStorage.setItem("pazooka_cart_v2", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("pazooka_wishlist_v2", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("pazooka_currency", currency);
  }, [currency]);

  const addToCart = (product, size, qty = 1, color = null) => {
    const chosen = size || product.sizes[0];
    const chosenColor = color || product.color || null;
    setCart((prev) => {
      const key = `${product.id}-${chosen}-${chosenColor || "default"}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size: chosen,
          color: chosenColor,
          qty,
        },
      ];
    });
    toast.success("ADDED TO CART", { description: `${product.name} — SIZE ${chosen}` });
  };

  const updateQty = (key, delta) =>
    setCart((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, i.qty + delta)) } : i))
    );

  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        toast("REMOVED FROM WISHLIST");
        return prev.filter((i) => i.id !== product.id);
      }
      toast.success("ADDED TO WISHLIST", { description: product.name });
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.original_price,
          image: product.images[0],
          images: product.images,
          sizes: product.sizes,
          category: product.category,
          tag: product.tag,
        },
      ];
    });
  };

  const cartCount = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((a, i) => a + i.price * i.qty, 0), [cart]);

  const formatPrice = (inr) => {
    const c = CURRENCIES[currency] || CURRENCIES.INR;
    return `${c.symbol}${Math.round(inr * c.rate).toLocaleString(c.locale)}`;
  };

  const value = {
    cart,
    wishlist,
    currency,
    setCurrency,
    formatPrice,
    cartOpen,
    setCartOpen,
    wishOpen,
    setWishOpen,
    quickView,
    setQuickView,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    cartCount,
    cartTotal,
    isWishlisted: (id) => wishlist.some((i) => i.id === id),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

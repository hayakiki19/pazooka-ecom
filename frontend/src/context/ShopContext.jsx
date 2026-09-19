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

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load("pazooka_cart"));
  const [wishlist, setWishlist] = useState(() => load("pazooka_wishlist"));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    localStorage.setItem("pazooka_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("pazooka_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, size, qty = 1) => {
    const chosen = size || product.sizes[0];
    setCart((prev) => {
      const key = `${product.id}-${chosen}`;
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

  const value = {
    cart,
    wishlist,
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

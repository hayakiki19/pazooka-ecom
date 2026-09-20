import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { useShop } from "../context/ShopContext";
import Stars from "./Stars";

const TAG_STYLES = {
  "NEW DROP": "bg-acid text-black",
  NEW: "bg-acid text-black",
  LIMITED: "bg-[#EE2643] text-white",
  BESTSELLER: "bg-black text-acid",
  HOT: "bg-[#FF3B30] text-white",
  POPULAR: "bg-white text-black border border-black",
  CORE: "bg-zinc-200 text-black",
};

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickView } = useShop();
  const wish = isWishlisted(product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group block border border-zinc-200 bg-white hover:border-black transition-colors duration-300 relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <img
          src={product.images[1]}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
        />
        <span className={`absolute top-3 left-3 font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 ${TAG_STYLES[product.tag] || "bg-black text-white"}`}>
          {product.tag}
        </span>
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button
            data-testid={`wishlist-toggle-${product.id}`}
            aria-label="Toggle wishlist"
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={`w-9 h-9 flex items-center justify-center border transition-colors ${wish ? "bg-acid border-acid text-black" : "bg-white/95 border-zinc-200 text-black hover:border-black"}`}
          >
            <Heart size={15} fill={wish ? "currentColor" : "none"} />
          </button>
          <button
            data-testid={`quick-view-${product.id}`}
            aria-label="Quick view"
            onClick={(e) => { e.preventDefault(); setQuickView(product); }}
            className="w-9 h-9 flex items-center justify-center bg-white/95 border border-zinc-200 text-black hover:border-black transition-colors"
          >
            <Eye size={15} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/95 backdrop-blur-sm px-3 py-2.5 hidden sm:flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] tracking-[0.25em] text-acid shrink-0">QUICK ADD</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {product.sizes.map((s) => (
              <button
                key={s}
                data-testid={`quick-add-${product.id}-${s}`}
                onClick={(e) => { e.preventDefault(); addToCart(product, s); }}
                className="min-w-8 h-8 px-1.5 border border-zinc-700 text-white text-[11px] font-mono hover:bg-acid hover:text-black hover:border-acid transition-colors"
              >
                {s === "OS" ? "ADD" : s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3.5 sm:p-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          {product.category === "caps" ? `HEADWEAR // ${product.fit}` : `${product.fit} // ${product.gsm}`}
        </p>
        <h3 className="font-syne font-bold text-sm sm:text-base uppercase leading-tight mt-1.5 group-hover:underline underline-offset-4 decoration-acid decoration-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-mono text-base font-bold">${product.price}</span>
          {product.original_price && (
            <span className="font-mono text-xs text-zinc-400 line-through">${product.original_price}</span>
          )}
        </div>
        {product.rating && product.rating.count > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5" data-testid={`card-rating-${product.id}`}>
            <Stars value={product.rating.avg} size={11} />
            <span className="font-mono text-[10px] text-zinc-500">{product.rating.avg.toFixed(1)} ({product.rating.count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Reveal } from "../components/motion";

const CATEGORIES = [
  { key: "all", label: "ALL DROPS" },
  { key: "oversized", label: "OVERSIZED" },
  { key: "regular", label: "REGULAR FIT" },
  { key: "caps", label: "CAPS" },
];

const TAGS = ["NEW DROP", "LIMITED", "BESTSELLER", "HOT", "POPULAR", "CORE"];

const TITLES = {
  all: "ALL DROPS",
  oversized: "OVERSIZED TEES",
  regular: "REGULAR FIT",
  caps: "CAPS & HEADWEAR",
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const tag = params.get("tag") || "";
  const [sort, setSort] = useState("featured");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: category !== "all" ? category : undefined,
      tag: tag || undefined,
      q: debouncedQ || undefined,
      sort: sort !== "featured" ? sort : undefined,
    })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, tag, debouncedQ, sort]);

  const setParam = (key, value) => {
    const next = Object.fromEntries(params.entries());
    if (value) next[key] = value;
    else delete next[key];
    setParams(next, { replace: true });
  };

  return (
    <div data-testid="shop-page">
      <section className="bg-ink text-white">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
          <Reveal y={20}>
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-acid mb-4">
              {tag ? `FILTERED // ${tag}` : "THE FULL CATALOG"}
            </p>
            <h1 className="font-display leading-[0.85] text-6xl sm:text-8xl">{TITLES[category] || "ALL DROPS"}</h1>
            <p className="font-mono text-xs text-zinc-400 tracking-widest mt-4" data-testid="shop-count">
              {loading ? "LOADING..." : `${products.length} PIECES`}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-[104px] z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200" data-testid="shop-filters">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                data-testid={`filter-${c.key}`}
                onClick={() => setParam("category", c.key === "all" ? "" : c.key)}
                className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] px-3.5 py-2 border transition-colors ${category === c.key ? "bg-black text-white border-black" : "border-zinc-300 hover:border-black"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-1.5 flex-wrap">
            {TAGS.map((t) => (
              <button
                key={t}
                data-testid={`tag-${t.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => setParam("tag", tag === t ? "" : t)}
                className={`font-mono text-[10px] tracking-[0.15em] px-3 py-2 border transition-colors ${tag === t ? "bg-acid text-black border-acid" : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                data-testid="shop-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="SEARCH"
                className="border border-zinc-300 focus:border-black pl-8 pr-3 py-2 font-mono text-[11px] tracking-widest w-32 sm:w-44 focus:outline-none transition-colors"
              />
              {q && (
                <button aria-label="Clear search" onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                  <X size={12} />
                </button>
              )}
            </div>
            <select
              data-testid="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-zinc-300 focus:border-black px-3 py-2 font-mono text-[11px] tracking-widest bg-white focus:outline-none cursor-pointer"
            >
              <option value="featured">FEATURED</option>
              <option value="price_asc">PRICE: LOW → HIGH</option>
              <option value="price_desc">PRICE: HIGH → LOW</option>
            </select>
          </div>
        </div>
      </div>

      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-zinc-200">
                <div className="aspect-[3/4] bg-zinc-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-zinc-100 animate-pulse w-1/2" />
                  <div className="h-4 bg-zinc-100 animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center" data-testid="shop-empty">
            <p className="font-display text-6xl sm:text-7xl text-zinc-200">NOTHING HERE. YET.</p>
            <p className="font-mono text-xs text-zinc-500 tracking-widest mt-4">TRY A DIFFERENT FILTER OR SEARCH.</p>
            <button
              data-testid="shop-reset-filters"
              onClick={() => { setParams({}, { replace: true }); setQ(""); setSort("featured"); }}
              className="mt-8 bg-acid text-black font-syne font-bold text-sm px-8 py-4 hover:bg-white transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.05} y={28}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

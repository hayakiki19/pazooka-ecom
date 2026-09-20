import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ARTICLES } from "../data/blog";
import { Reveal } from "../components/motion";

export default function Blog() {
  useEffect(() => {
    document.title = "The Drop Journal — PAZOOKA Streetwear Blog | Oversized Fits, GSM Guides & Style";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "PAZOOKA blog: premium oversized t-shirt fit guides, 280 GSM fabric breakdowns, oversized vs regular fit, streetwear cap guides and styling formulas — built for India's streetwear scene.");
  }, []);

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20" data-testid="blog-page">
      <Reveal y={20}>
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-zinc-500 mb-4">THE DROP JOURNAL</p>
        <h1 className="font-display text-6xl sm:text-8xl leading-[0.85]">
          STREETWEAR,<br />DECODED<span className="text-acid">.</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base mt-6 max-w-lg leading-relaxed">
          Fit guides, fabric science and styling formulas from the PAZOOKA studio —
          for India's premium oversized and regular-fit streetwear crowd.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-12">
        {ARTICLES.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 3) * 0.06} y={28}>
            <Link to={`/blog/${a.slug}`} data-testid={`blog-card-${a.slug}`} className="group block border border-zinc-200 bg-white hover:border-black transition-colors duration-300">
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                <img src={a.image} alt={a.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 left-3 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{a.tag}</span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">{a.date} // {a.read}</p>
                <h2 className="font-syne font-bold text-lg leading-tight mt-2 group-hover:underline underline-offset-4 decoration-acid decoration-2">{a.title}</h2>
                <p className="text-zinc-600 text-sm leading-relaxed mt-2.5 line-clamp-2">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.2em] mt-4 group-hover:gap-2.5 transition-all">
                  READ <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

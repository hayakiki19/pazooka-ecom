import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ARTICLES } from "../data/blog";
import { Reveal } from "../components/motion";

export default function BlogPost() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} — PAZOOKA Journal`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", article.excerpt);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: article.image,
      author: { "@type": "Organization", name: "PAZOOKA" },
      publisher: { "@type": "Organization", name: "PAZOOKA Streetwear" },
    });
    document.head.appendChild(script);
    return () => document.getElementById("article-schema")?.remove();
  }, [article]);

  if (!article) {
    return (
      <div className="py-32 text-center" data-testid="blog-not-found">
        <p className="font-display text-7xl text-zinc-200">PAGE LOST IN THE STATIC.</p>
        <Link to="/blog" className="mt-8 inline-block bg-black text-white font-syne font-bold text-sm px-8 py-4 hover:bg-acid hover:text-black transition-colors">
          BACK TO THE JOURNAL
        </Link>
      </div>
    );
  }

  const categoryTo = `/shop?category=${article.category}`;

  return (
    <div data-testid="blog-post-page">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 pt-10 sm:pt-16">
        <Link to="/blog" className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 hover:text-black flex items-center gap-2 w-fit">
          <ArrowLeft size={12} /> THE JOURNAL
        </Link>
        <Reveal y={20}>
          <div className="flex items-center gap-3 mt-8">
            <span className="bg-acid font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{article.tag}</span>
            <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">{article.date} // {article.read}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[0.9] mt-5" data-testid="blog-title">{article.title}</h1>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-10">
          <div className="relative aspect-[16/8] overflow-hidden bg-zinc-100 border border-zinc-200">
            <img src={article.image} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </Reveal>

      <div className="max-w-[760px] mx-auto px-4 sm:px-8 py-12">
        <p className="font-syne font-bold text-lg leading-relaxed">{article.excerpt}</p>
        <div className="mt-8 space-y-6">
          {article.body.map((p, i) => (
            <Reveal key={i} delay={0.03 * i} y={16}>
              <p className="text-zinc-700 text-[15px] leading-[1.85]">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 bg-ink text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-acid mb-2">SHOP THE STORY</p>
              <h2 className="font-display text-3xl leading-[0.9]">
                {article.category === "caps" ? "CAPS & HEADWEAR" : article.category === "regular" ? "REGULAR FIT TEES" : "OVERSIZED TEES"}
              </h2>
            </div>
            <Link to={categoryTo} data-testid="blog-shop-cta" className="group inline-flex items-center gap-2 bg-acid text-black font-syne font-bold text-sm px-7 py-3.5 hover:bg-white transition-colors shrink-0">
              SHOP NOW <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

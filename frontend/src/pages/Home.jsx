import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import Marquee from "../components/Marquee";
import { Reveal } from "../components/motion";

const HERO_IMG = "https://images.pexels.com/photos/18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1100&fit=crop";
const CAMPAIGN_1 = "https://images.unsplash.com/photo-1721637686340-de9f8cebda5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=1600";
const CAMPAIGN_2 = "https://images.unsplash.com/photo-1721637635502-b0abaaa75edb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwyfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=1600";
const BENTO_OVERSIZED = "https://images.pexels.com/photos/32819862/pexels-photo-32819862.jpeg?auto=compress&cs=tinysrgb&w=1200";
const BENTO_REGULAR = "https://images.pexels.com/photos/35515095/pexels-photo-35515095.jpeg?auto=compress&cs=tinysrgb&w=800";
const BENTO_CAPS = "https://images.unsplash.com/photo-1532332248682-206cc786359f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=1600";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative h-[100svh] min-h-[620px] bg-ink overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img src={HERO_IMG} alt="PAZOOKA streetwear editorial" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />
      </motion.div>

      <div className="absolute -bottom-3 left-0 right-0 z-[5] pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <p className="font-display text-stroke-white text-[23vw] leading-[0.78] text-center whitespace-nowrap">PAZOOKA</p>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -24 }}
        animate={{ scale: 1, rotate: -6 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 14 }}
        className="absolute top-20 sm:top-24 right-4 sm:right-12 z-10 bg-acid text-black font-mono text-[10px] sm:text-xs font-bold tracking-[0.15em] px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.65)]"
        data-testid="hero-limited-badge"
      >
        LIMITED EDITION //<br />250 PIECES ONLY
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 h-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-wrap gap-3 sm:justify-end"
        >
          <Link data-testid="hero-shop-cta" to="/shop" className="group inline-flex items-center gap-3 bg-acid text-black font-syne font-bold text-sm tracking-wide px-8 py-4 hover:bg-white transition-colors duration-200">
            SHOP NEW DROPS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link data-testid="hero-oversized-cta" to="/shop?category=oversized" className="inline-flex items-center gap-3 border border-white/60 text-white font-syne font-bold text-sm px-8 py-4 hover:bg-white hover:text-black transition-colors duration-200">
            EXPLORE OVERSIZED
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function CampaignBanner({ img, overline, line1, line2, copy, cta, to, testId }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} data-testid={testId} className="relative h-[78vh] min-h-[540px] overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0 will-change-transform">
        <img src={img} alt="" className="h-full w-full object-cover opacity-60" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="relative z-10 h-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center">
        <Reveal>
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-acid mb-5">{overline}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-white leading-[0.85] text-6xl sm:text-8xl lg:text-9xl">
            {line1}<br /><span className="text-acid">{line2}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-zinc-300 max-w-md mt-6 text-sm sm:text-base leading-relaxed">{copy}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <Link to={to} data-testid={`${testId}-cta`} className="group mt-8 inline-flex items-center gap-3 bg-acid text-black font-syne font-bold text-sm px-8 py-4 w-fit hover:bg-white transition-colors duration-200">
            {cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

const CELLS = [
  { title: "OVERSIZED TEES", sub: "280 GSM HEAVYWEIGHT DROP", badge: "10 STYLES", to: "/shop?category=oversized", img: BENTO_OVERSIZED, cls: "md:col-span-8 md:row-span-2 md:min-h-[576px]" },
  { title: "REGULAR FIT", sub: "CLEAN TAILORED CUT", badge: "06 STYLES", to: "/shop?category=regular", img: BENTO_REGULAR, cls: "md:col-span-4" },
  { title: "CAPS & HEADWEAR", sub: "5-PANEL // TRUCKER // DAD", badge: "05 STYLES", to: "/shop?category=caps", img: BENTO_CAPS, cls: "md:col-span-4" },
];

const CHAPTERS = [
  { n: "01", t: "HEAVYWEIGHT ONLY", d: "280+ GSM combed cotton. No thin, disposable blanks — every tee drapes like armour and survives the wash-cycle war." },
  { n: "02", t: "LIMITED RUNS", d: "250 pieces per drop. When it's gone, it's gone forever. No restocks, no reprints, no mercy." },
  { n: "03", t: "BUILT LOUD", d: "Oversized silhouettes, acid accents, graphics ripped straight from street static. Subtlety is not our size." },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
  }, []);

  const newDrops = [...products].sort((a, b) => b.drop_index - a.drop_index).slice(0, 8);
  const heat = products.filter((p) => ["BESTSELLER", "HOT", "POPULAR"].includes(p.tag)).slice(0, 8);

  return (
    <div data-testid="home-page">
      <Hero />

      <div className="bg-ink border-y border-zinc-800 py-4 sm:py-5 marquee-paused" data-testid="home-marquee">
        <Marquee
          duration={55}
          items={["PAZOOKA STREETWEAR", "OVERSIZED FIT SPECIALISTS", "HEAVYWEIGHT 280 GSM COTTON", "NEW DROPS EVERY FRIDAY", "FREE WORLDWIDE SHIPPING $75+"]}
          itemClassName="font-display text-2xl sm:text-4xl text-white tracking-wide pt-1"
          sepClassName="text-acid"
        />
      </div>

      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24" data-testid="new-drops-section">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <Reveal><p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-zinc-500 mb-3">FRESH HEAT // VOL.04</p></Reveal>
            <Reveal delay={0.05}><h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.85]">NEW DROPS</h2></Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link to="/shop" data-testid="view-all-link" className="hidden sm:inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-400 transition-colors">
              VIEW ALL 21 <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {newDrops.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06} y={32}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <CampaignBanner
        testId="campaign-acid-culture"
        img={CAMPAIGN_1}
        overline="CAMPAIGN VOL.04"
        line1="THE ACID"
        line2="CULTURE."
        copy="Glowing lime on matte black. Heavyweight streetwear engineered for the ones who never blend in. 250 pieces, then the vault closes."
        cta="SHOP THE DROP"
        to="/shop?tag=NEW DROP"
      />

      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24" data-testid="collections-section">
        <Reveal><p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-zinc-500 mb-3">PICK YOUR POISON</p></Reveal>
        <Reveal delay={0.05}><h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.85] mb-10">COLLECTIONS</h2></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:auto-rows-[280px]">
          {CELLS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className={c.cls}>
              <Link to={c.to} data-testid={`collection-${c.title.toLowerCase().replace(/\s+/g, "-")}`} className="group relative block h-full min-h-[280px] overflow-hidden bg-ink">
                <img src={c.img} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-acid text-black font-mono text-[10px] font-bold tracking-widest px-2.5 py-1">{c.badge}</span>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-4xl sm:text-5xl text-white leading-[0.85]">{c.title}</h3>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-300 mt-2">{c.sub}</p>
                  </div>
                  <span className="w-10 h-10 shrink-0 bg-white text-black flex items-center justify-center group-hover:bg-acid transition-colors">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CampaignBanner
        testId="campaign-tee-matrix"
        img={CAMPAIGN_2}
        overline="SILHOUETTE STUDY"
        line1="OVERSIZED"
        line2="TEE MATRIX."
        copy="Ten unique cuts engineered for the Gen-Z silhouette. Dropped shoulders, extended hems, box torsos. Find your geometry."
        cta="SHOP OVERSIZED"
        to="/shop?category=oversized"
      />

      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24" data-testid="heat-section">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <Reveal><p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-zinc-500 mb-3">MOST WANTED</p></Reveal>
            <Reveal delay={0.05}><h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.85]">THE HEAT</h2></Reveal>
          </div>
          <Reveal delay={0.1}><p className="hidden sm:block font-mono text-[10px] tracking-[0.25em] text-zinc-400">SCROLL →</p></Reveal>
        </div>
        <div className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {heat.map((p) => (
            <div key={p.id} className="min-w-[240px] sm:min-w-[300px] snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white" data-testid="manifesto-section">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-32">
          <Reveal><p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-acid mb-5">THE MANIFESTO</p></Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display leading-[0.85] text-6xl sm:text-8xl lg:text-9xl max-w-5xl">
              NO RULES.<br />NO COMPROMISE.<br /><span className="text-stroke-white">PURE STREET CULTURE.</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 mt-16">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.1} className="bg-ink">
                <div className="p-8 sm:p-10 h-full">
                  <span className="font-mono text-acid text-sm font-bold">{c.n}</span>
                  <h3 className="font-syne font-extrabold text-xl sm:text-2xl uppercase mt-4">{c.t}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mt-3">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Link to="/shop" data-testid="manifesto-cta" className="group mt-12 inline-flex items-center gap-3 border border-white text-white font-syne font-bold text-sm px-8 py-4 hover:bg-acid hover:text-black hover:border-acid transition-colors duration-200">
              JOIN THE MOVEMENT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

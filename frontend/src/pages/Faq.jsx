import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "../components/motion";

const FAQS = [
  {
    q: "What makes PAZOOKA oversized t-shirts premium?",
    a: "Every PAZOOKA oversized t-shirt is cut from 280-320 GSM heavyweight combed cotton — nearly double the weight of fast-fashion tees. They're pre-shrunk, garment-dyed, and bio-washed, with dropped shoulders and a boxy silhouette engineered for streetwear fits. Prints are puff or high-density, made to survive years of washes.",
  },
  {
    q: "What does 280 GSM mean for a t-shirt?",
    a: "GSM is grams per square metre — fabric weight. Regular retail tees are 140-180 GSM. Our heavyweight streetwear tees start at 240 GSM (regular fit) and go up to 320 GSM. Higher GSM means the tee holds its boxy shape, doesn't turn see-through, and the collar never bacons out.",
  },
  {
    q: "How do oversized t-shirts fit? Should I size down?",
    a: "Our oversized tees are true-to-size for the oversized look — buy your normal size and the cut gives you dropped shoulders, a wide chest and an extended hem. If you're between sizes or want a less dramatic drape, size down once. A full size guide with chest and length measurements is on every product page.",
  },
  {
    q: "What's the difference between your oversized and regular fit t-shirts?",
    a: "Oversized tees (280-320 GSM) re-draw your silhouette with dropped shoulders and a boxy torso — a statement fit. Regular fit tees (240 GSM) follow your natural frame with shoulder seams on the bone and a clean hem at the hip — perfect for layering and everyday wear. Both are heavyweight by industry standards.",
  },
  {
    q: "Do you ship across India? What are the charges?",
    a: "Yes, we ship pan-India. Shipping is free on all orders over ₹2,999; below that it's a flat ₹99. Orders dispatch within 48 hours. Metro cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad) get delivery in 2-3 days, the rest of India in 4-6 days, and remote PIN codes in 6-8 days. Check your exact estimate with the PIN checker on any product page.",
  },
  {
    q: "Is Cash On Delivery (COD) available?",
    a: "COD is available on eligible PIN codes — enter your PIN in the delivery checker on any product page to confirm. Remote regions are prepaid-only.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted only for defective, damaged, incorrect, or undelivered products, and must be requested within 24 hours of delivery through your account page.",
  },
  {
    q: "How do refunds work?",
    a: "Approved returns are refunded as a store credit coupon code valid for 50 days, issued to your registered email after the returned piece passes inspection.",
  },
  {
    q: "Can I exchange my t-shirt or cap?",
    a: "Exchanges are strictly allowed only for size-related issues. Product exchanges (swapping one design for another) are not permitted under any circumstances.",
  },
  {
    q: "Do sold-out drops ever restock?",
    a: "No. Every PAZOOKA drop is a limited run of 250 pieces. When it's gone, it's gone — no restocks, no reprints. New drops land every Friday; join the newsletter in the footer for drop intel.",
  },
  {
    q: "How do I wash heavyweight streetwear tees?",
    a: "Machine wash cold, inside out, with similar colours. Never tumble dry — hang dry in shade to protect the print and the garment dye. Our tees are pre-shrunk, so they won't shrink further if you follow this.",
  },
  {
    q: "Where can I track my order?",
    a: "Sign in and open your account page — every order has a live tracking timeline (Confirmed → Packed → Shipped → Delivered) plus one-tap return and exchange requests.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    document.title = "FAQ — PAZOOKA Streetwear | Shipping, Returns, Sizing & GSM Guide";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "PAZOOKA FAQ: premium oversized t-shirts in India, 280 GSM fabric explained, shipping & COD, 24-hour returns, size-only exchanges, and limited weekly drops.");

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => document.getElementById("faq-schema")?.remove();
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-12 sm:py-20" data-testid="faq-page">
      <Reveal y={20}>
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-zinc-500 mb-4">STRAIGHT ANSWERS</p>
        <h1 className="font-display text-6xl sm:text-8xl leading-[0.85]">
          FREQUENTLY<br />ASKED<span className="text-acid">.</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base mt-6 max-w-lg leading-relaxed">
          Everything about PAZOOKA premium oversized t-shirts, regular fits, heavyweight GSM fabric,
          India-wide shipping, returns and limited drops.
        </p>
      </Reveal>

      <div className="mt-12 border-t-2 border-black">
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={Math.min(i, 6) * 0.04} y={16}>
            <div className="border-b border-zinc-200">
              <button
                data-testid={`faq-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
              >
                <span className="font-syne font-bold text-sm sm:text-base group-hover:text-zinc-500 transition-colors">{f.q}</span>
                <span className={`w-8 h-8 shrink-0 flex items-center justify-center border transition-colors ${open === i ? "bg-black text-acid border-black" : "border-zinc-300 group-hover:border-black"}`}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm text-zinc-600 leading-relaxed max-w-2xl">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 bg-ink text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl leading-[0.9]">STILL STUCK?</h2>
            <p className="text-zinc-400 text-sm mt-2">Drop us a line — support replies within 24 hours.</p>
          </div>
          <a href="mailto:support@pazooka.in" data-testid="faq-contact" className="bg-acid text-black font-syne font-bold text-sm px-8 py-4 hover:bg-white transition-colors shrink-0">
            SUPPORT@PAZOOKA.IN
          </a>
        </div>
      </Reveal>
    </div>
  );
}

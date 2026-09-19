import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("ENTER A VALID EMAIL");
      return;
    }
    toast.success("YOU'RE ON THE LIST", { description: "VOL.05 drop intel incoming." });
    setEmail("");
  };

  return (
    <footer className="bg-ink text-white" data-testid="footer">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 pb-16 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-acid mb-4">JOIN THE MOVEMENT</p>
            <h2 className="font-display text-5xl sm:text-6xl leading-[0.9]">
              DROP INTEL.<br />STRAIGHT TO YOU.
            </h2>
            <form onSubmit={subscribe} className="mt-8 flex max-w-md" data-testid="newsletter-form">
              <input
                data-testid="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR@EMAIL.COM"
                className="flex-1 bg-transparent border border-zinc-700 focus:border-acid px-4 py-3.5 font-mono text-xs tracking-widest placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
              <button data-testid="newsletter-submit" type="submit" className="bg-acid text-black px-5 flex items-center justify-center hover:bg-white transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">SHOP</p>
              <ul className="space-y-2.5 font-syne font-bold text-sm uppercase">
                <li><Link to="/shop" className="hover:text-acid transition-colors">All Drops</Link></li>
                <li><Link to="/shop?category=oversized" className="hover:text-acid transition-colors">Oversized</Link></li>
                <li><Link to="/shop?category=regular" className="hover:text-acid transition-colors">Regular Fit</Link></li>
                <li><Link to="/shop?category=caps" className="hover:text-acid transition-colors">Caps</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">VIBES</p>
              <ul className="space-y-2.5 font-syne font-bold text-sm uppercase">
                <li><Link to="/shop?tag=NEW DROP" className="hover:text-acid transition-colors">New Drops</Link></li>
                <li><Link to="/shop?tag=LIMITED" className="hover:text-acid transition-colors">Limited Runs</Link></li>
                <li><Link to="/shop?tag=BESTSELLER" className="hover:text-acid transition-colors">Bestsellers</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">INFO</p>
              <ul className="space-y-2.5 font-mono text-xs text-zinc-400">
                <li>Free shipping $75+</li>
                <li>30-day returns</li>
                <li>Ships in 48h</li>
                <li>280 GSM or nothing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-10 overflow-hidden select-none pointer-events-none" aria-hidden="true">
          <p className="font-display text-stroke-white text-[18vw] leading-[0.8] text-center whitespace-nowrap">PAZOOKA</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 border-t border-zinc-800 font-mono text-[10px] tracking-[0.25em] text-zinc-500">
          <span>© 2026 PAZOOKA STREETWEAR</span>
          <span>NO RULES. NO COMPROMISE.</span>
          <span>BUILT LOUD — EST. UNDERGROUND</span>
        </div>
      </div>
    </footer>
  );
}

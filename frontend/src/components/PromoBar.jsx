import Marquee from "./Marquee";

const MSGS = [
  "VOL.04 ACID CULTURE — LIVE NOW",
  "FREE SHIPPING OVER $75",
  "CODE PAZOOKA10 = 10% OFF",
  "NEW DROPS EVERY FRIDAY",
  "280 GSM HEAVYWEIGHT ONLY",
];

export default function PromoBar() {
  return (
    <div data-testid="promo-bar" className="bg-ink text-acid font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] py-2 border-b border-zinc-800">
      <Marquee items={MSGS} duration={30} sepClassName="text-zinc-600" />
    </div>
  );
}

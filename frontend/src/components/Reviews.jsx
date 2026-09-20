import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { createReview, fetchReviews } from "../lib/api";
import Stars from "./Stars";
import { Reveal } from "./motion";

const inputCls =
  "w-full border border-zinc-300 focus:border-black px-4 py-3 text-sm focus:outline-none transition-colors bg-white";

export default function Reviews({ productId }) {
  const [data, setData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => fetchReviews(productId).then(setData).catch(() => {});

  useEffect(() => {
    setData(null);
    load();
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview(productId, form);
      toast.success("REVIEW POSTED");
      setForm({ name: "", rating: 5, title: "", comment: "" });
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "COULDN'T POST REVIEW");
    } finally {
      setSubmitting(false);
    }
  };

  if (!data) return null;

  return (
    <section id="reviews" data-testid="reviews-section" className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 border-t border-zinc-200">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-zinc-500 mb-3">WORD ON THE STREET</p>
            <h2 className="font-display text-5xl sm:text-6xl leading-[0.85]">REVIEWS</h2>
          </div>
          <button
            data-testid="write-review-btn"
            onClick={() => setFormOpen(!formOpen)}
            className="self-start sm:self-auto bg-black text-white font-syne font-bold text-sm px-6 py-3.5 hover:bg-acid hover:text-black transition-colors"
          >
            {formOpen ? "CLOSE" : "WRITE A REVIEW"}
          </button>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-3">
          <div className="border border-zinc-200 p-6 text-center lg:sticky lg:top-32">
            <p className="font-display text-7xl leading-none" data-testid="reviews-avg">{data.avg.toFixed(1)}</p>
            <Stars value={data.avg} size={16} className="justify-center mt-3" />
            <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mt-3" data-testid="reviews-count">
              {data.count} VERIFIED REVIEW{data.count === 1 ? "" : "S"}
            </p>
          </div>
        </Reveal>

        <div className="lg:col-span-9 space-y-4">
          {formOpen && (
            <form onSubmit={submit} data-testid="review-form" className="border-2 border-black p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 mr-2">YOUR RATING</span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-testid={`star-input-${n}`}
                    onClick={() => setForm({ ...form, rating: n })}
                    className={`w-9 h-9 border font-mono text-sm transition-colors ${form.rating >= n ? "bg-black text-acid border-black" : "border-zinc-300 hover:border-black"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input data-testid="review-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="YOUR NAME" className={inputCls} />
                <input data-testid="review-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="HEADLINE (OPTIONAL)" className={inputCls} />
              </div>
              <textarea data-testid="review-comment" required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="HOW'S THE FIT, THE FABRIC, THE DROP?" className={`${inputCls} resize-none`} />
              <button data-testid="review-submit-btn" type="submit" disabled={submitting} className="bg-acid text-black font-syne font-bold text-sm px-8 py-3.5 hover:bg-black hover:text-acid transition-colors disabled:opacity-50">
                {submitting ? "POSTING..." : "POST REVIEW"}
              </button>
            </form>
          )}

          {data.reviews.map((r, i) => (
            <Reveal key={i} delay={Math.min(i, 5) * 0.05} y={20}>
              <div data-testid={`review-item-${i}`} className="border border-zinc-200 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Stars value={r.rating} />
                    {r.title && <span className="font-syne font-bold text-sm uppercase">{r.title}</span>}
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 tracking-widest">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mt-3">{r.comment}</p>
                <div className="flex items-center gap-1.5 mt-3 font-mono text-[10px] tracking-widest text-zinc-500">
                  <span className="text-black font-bold">{r.name.toUpperCase()}</span>
                  {r.verified && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      // <BadgeCheck size={11} className="text-acid" strokeWidth={2.5} /> VERIFIED BUYER
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

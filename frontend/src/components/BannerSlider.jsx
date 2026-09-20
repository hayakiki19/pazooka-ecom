import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerSlider({ images, interval = 5000, imgClassName = "", showDots = true, showArrows = false, testId = "banner" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  const go = (dir) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div className="absolute inset-0" data-testid={`${testId}-slider`}>
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </AnimatePresence>

      {showArrows && (
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          <button
            data-testid={`${testId}-prev`}
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="w-11 h-11 border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-acid hover:text-black hover:border-acid transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            data-testid={`${testId}-next`}
            aria-label="Next slide"
            onClick={() => go(1)}
            className="w-11 h-11 border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-acid hover:text-black hover:border-acid transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showDots && (
        <div className="absolute bottom-6 left-4 sm:left-8 lg:left-12 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              data-testid={`${testId}-dot-${i}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-300 ${i === index ? "w-10 bg-acid" : "w-5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

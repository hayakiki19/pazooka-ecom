import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export function MaskedLine({ children, delay = 0, className = "", as = "span" }) {
  const Tag = motion[as] || motion.span;
  return (
    <span className={`block overflow-hidden ${className}`}>
      <Tag
        className="block will-change-transform"
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </Tag>
    </span>
  );
}

export function Reveal({ children, delay = 0, y = 48, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Very small scroll parallax. Only switches on for desktop pointers above
 * 1024px, and never when the visitor prefers reduced motion — mobile gets
 * the same composition with zero extra work per frame.
 */
export default function Parallax({
  children,
  strength = 18,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return wide && !reduceMotion ? (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  ) : (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

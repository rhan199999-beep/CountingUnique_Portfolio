"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // If the animation loop never runs (blocked HMR, backgrounded tab),
  // force content visible after a short delay so nothing stays hidden.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay, ease: "easeOut" }}
      style={{ opacity: visible || reduceMotion ? 1 : undefined }}
    >
      {children}
    </motion.div>
  );
}
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { PARTNERS, partnerUrl } from "@/data/partners";
import { COUNTING_UNIQUE } from "@/data/channels";

/**
 * Brand collabs — an orange logo wall with uniform, aligned tiles.
 * Every tile shows the brand's own mark and links to the live
 * channel search for that brand's uploads.
 */

export default function Partners() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="partners" className="relative scroll-mt-20 overflow-hidden border-t-2 border-ink bg-brand/10">
      {/* subtle dot texture */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(15,15,15,0.14) 1.5px, transparent 1.6px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-14 sm:px-8 lg:px-12">
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-[18ch] text-5xl leading-[0.9] font-extrabold tracking-tight text-ink sm:text-6xl">
            Brands we&apos;ve collaborated with.
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p, i) => (
            <motion.a
              key={p.name}
              href={partnerUrl(COUNTING_UNIQUE.handle, p)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} videos on Counting Unique`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : (i % 6) * 0.05,
                ease: "easeOut",
              }}
              style={{ opacity: visible || reduceMotion ? 1 : undefined }}
              className="group flex aspect-[16/9] w-full items-center justify-center rounded-xl border-2 border-ink bg-white p-3 shadow-[3px_3px_0_0_#0f0f0f] transition-transform duration-200 hover:-translate-y-1"
            >
              <Image
                src={p.logo}
                alt={`${p.name} logo`}
                width={280}
                height={112}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-110"
                draggable={false}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
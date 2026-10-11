"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PARTNERS, partnerSearchUrl } from "@/data/partners";
import { COUNTING_UNIQUE } from "@/data/channels";

/**
 * Brand collabs — an orange logo wall with uniform, aligned tiles.
 * Every tile shows the brand's own mark and links to the live
 * channel search for that brand's uploads.
 */

export default function Partners() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="partners" className="relative scroll-mt-20 overflow-hidden border-t-2 border-ink bg-[#C6F5D5]">
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
        <p className="-rotate-2 inline-block rounded-xl border-2 border-ink bg-ink px-4 py-1.5 text-sm font-extrabold tracking-wide text-white uppercase shadow-[3px_3px_0_0_#ffffff]">
          ★ Paid collabs, not ad reads ★
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-[18ch] text-5xl leading-[0.9] font-extrabold tracking-tight text-ink sm:text-6xl">
            Brands we&apos;ve collaborated with.
          </h2>
          <p className="rotate-1 rounded-full border-2 border-ink bg-ink px-4 py-1.5 font-mono text-[13px] font-semibold text-white shadow-[3px_3px_0_0_#ffffff]">
            {String(PARTNERS.length).padStart(2, "0")} BRANDS ✺ TAP A LOGO TO VERIFY
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNERS.map((p, i) => (
            <motion.a
              key={p.name}
              href={partnerSearchUrl(COUNTING_UNIQUE.handle, p.query)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} videos on Counting Unique`}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : (i % 5) * 0.05,
                ease: "easeOut",
              }}
              className="group flex min-w-0 items-center justify-center px-2"
            >
              <Image
                src={p.logo}
                alt={`${p.name} logo`}
                width={280}
                height={112}
                loading="lazy"
                className="max-h-16 w-auto max-w-[190px] object-contain transition-transform duration-200 group-hover:scale-110"
                draggable={false}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

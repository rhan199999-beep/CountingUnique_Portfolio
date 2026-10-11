"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { COUNTING_UNIQUE, PRANAY_GUPTA, PRANAY_AVATAR } from "@/data/channels";

export default function Hero({ pgSubs }: { pgSubs: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="dots-bg bg-[#E9F4FE] px-5 pt-10 pb-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_360px]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            <h1 className="font-display mt-5 text-balance text-6xl leading-[0.9] tracking-tight text-ink sm:text-7xl lg:text-8xl">
              Hey, I&apos;m{" "}
              <span className="inline-block -rotate-2 rounded-2xl border-[3px] border-ink bg-[#FFD23F] px-3 shadow-[5px_5px_0_0_#0f0f0f]">
                Pranay,
              </span>{" "}
              making{" "}
              <span className="marker-sky">lifestyle-based videos.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink/75 sm:text-lg">
              Long experiments on Counting Unique. Shorts on @saypranay. New
              uploads land on this page by themselves.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={COUNTING_UNIQUE.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-accent px-8 text-[17px] font-semibold text-white shadow-[5px_5px_0_0_#0f0f0f] transition-transform hover:-translate-y-1 hover:rotate-1 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Subscribe on YouTube
              </a>
              <a
                href="#latest"
                className="text-[15px] font-medium text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
              >
                or skip to the videos ↓
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.15,
              ease: "easeOut",
            }}
            className={`group relative mx-auto w-64 sm:w-72 lg:w-full lg:max-w-[340px] ${
              reduceMotion ? "rotate-3" : "animate-float"
            }`}
          >
            {/* cartoon pop-art dots over the photo */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.28) 1.5px, transparent 1.6px)",
                backgroundSize: "14px 14px",
              }}
            />
            <Image
              src={PRANAY_AVATAR}
              alt="Pranay Gupta"
              width={512}
              height={512}
              priority
              className="aspect-square w-full rounded-2xl border-[3px] border-ink object-cover shadow-[8px_8px_0_0_#005faf]"
            />
            <span className="animate-wiggle absolute -bottom-4 -left-4 -rotate-3 rounded-lg border-2 border-ink bg-paper px-3 py-1 font-mono text-[13px] text-ink shadow-[3px_3px_0_0_#0f0f0f]">
              {PRANAY_GUPTA.handle}
            </span>
            <span className="animate-wiggle absolute -right-3 -top-4 rotate-6 rounded-lg border-2 border-ink bg-accent px-3 py-1 font-mono text-[13px] text-white shadow-[3px_3px_0_0_#0f0f0f]">
              {pgSubs} subs
            </span>
            {/* spinning cartoon badge */}
            <span
              aria-hidden
              className="absolute -bottom-8 -right-8 hidden h-28 w-28 items-center justify-center rounded-full border-[3px] border-ink bg-[#FFD23F] shadow-[4px_4px_0_0_#0f0f0f] sm:flex"
            >
              <svg viewBox="0 0 100 100" className={`h-full w-full ${reduceMotion ? "" : "animate-spin-slow"}`}>
                <defs>
                  <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                </defs>
                <text fontSize="12.5" fontWeight="800" letterSpacing="2.5" fill="#0f0f0f">
                  <textPath href="#badge-circle">★ COUNTING UNIQUE ★ PRANAY</textPath>
                </text>
              </svg>
              <span className="absolute text-2xl">▶</span>
            </span>
            {/* floating sparkles */}
            <span aria-hidden className="absolute -left-8 top-8 hidden text-3xl text-accent sm:block">
              ✺
            </span>
            <span aria-hidden className="absolute -right-6 bottom-16 hidden rotate-12 text-2xl text-brand sm:block">
              ★
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}

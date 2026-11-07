"use client";

import Image from "next/image";
import { PARTNERS, partnerUrl } from "@/data/partners";
import { COUNTING_UNIQUE } from "@/data/channels";

/**
 * Brand collabs — horizontal moving logo marquee, laid out in three
 * staggered rows. Every mark is normalised to the same optical height inside
 * an identical tile so wide wordmarks (Groww, Zomato, Swiggy) no longer look
 * tiny next to square marks. Tiles link to the specific collab video when
 * one is known.
 */
export default function Partners() {
  const rows = Array.from(
    { length: Math.ceil(PARTNERS.length / 6) },
    (_, r) => ({ row: PARTNERS.slice(r * 6, r * 6 + 6) })
  );

  return (
    <section
      id="partners"
      className="relative scroll-mt-24 overflow-hidden border-b-2 border-ink bg-mist"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(8,36,63,0.14) 1.5px, transparent 1.6px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display mt-1.5 max-w-[18ch] text-4xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-5xl">
              Brands we&apos;ve collaborated with.
            </h2>
          </div>
          <a
            href="#work"
            className="inline-flex min-h-[44px] items-center text-[14px] font-bold text-ink underline decoration-brand decoration-[3px] underline-offset-4 hover:text-brand"
          >
            Work with me →
          </a>
        </div>
      </div>

      {/* Full-bleed brick wall — three staggered rows that drift sideways;
          edges fade out so no tile is ever sliced in half. */}
      <div className="marquee-mask relative mt-8 w-full pb-12 sm:mt-10 sm:pb-16">
        {rows.map(({ row }, r) => (
          <div
            key={r}
            className={`relative w-full overflow-hidden ${
              r > 0 ? "mt-3 sm:mt-5 lg:mt-7" : ""
            }`}
          >
            {/* The -50% shift must be measured on the track itself,
                otherwise the loop jumps by half the viewport. Each row is
                phase-shifted so the bricks never line up in columns. */}
            <div
              className="animate-ticker flex w-max items-center"
              style={{ animationDelay: `-${r * 7}s` }}
            >
              {[...row, ...row].map((p, i) => (
                <a
                  key={`marquee-${p.name}-${i}`}
                  href={partnerUrl(COUNTING_UNIQUE.handle, p)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name} videos on Counting Unique`}
                  title={`${p.name} collab`}
                  className="group relative mr-3 flex h-16 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-ink bg-white p-2 shadow-[3px_3px_0_0_#08243f] transition-transform duration-200 hover:-translate-y-1 sm:mr-5 sm:h-20 sm:w-48 sm:rounded-xl sm:p-2.5 lg:mr-10 lg:h-32 lg:w-64 lg:p-3"
                >
                  <Image
                    src={p.logo}
                    alt=""
                    width={280}
                    height={112}
                    className="h-auto w-auto max-h-5 max-w-full object-contain sm:max-h-7 lg:max-h-9"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { COUNTING_UNIQUE, WHATSAPP_CHANNEL } from "@/data/channels";
import Reveal from "./Reveal";

/**
 * The dedicated brand / collaborator path. Real, contextual numbers only —
 * subscriber count, recent views and commercial metrics.
 */
export default function WorkWithMe({ cuSubs }: { cuSubs: string }) {
  return (
    <section
      id="work"
      className="scroll-mt-24 border-y-2 border-ink bg-brand text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-12">
        <Reveal>
          <p className="inline-block -rotate-1 rounded-xl border border-white/25 bg-white/15 px-4 py-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[3px_3px_0_0_rgba(255,255,255,0.2)]">
            Brands &amp; Collaborators
          </p>
          <h2 className="font-display mt-3 max-w-[18ch] text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Give me something{" "}
            <span className="inline-block -rotate-1 text-ink">
              <span className="relative">
                <span className="relative z-10">worth filming.</span>
                <span
                  aria-hidden
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#FFD23F]/80 -z-0"
                />
              </span>
            </span>
          </h2>
          <p className="font-display mt-5 max-w-[52ch] text-lg font-semibold leading-snug tracking-tight text-white/85 sm:text-xl">
            No boring ad reads. We turn your product into an engaging,
            high-retention story that audiences actually watch to the end.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-action px-7 text-[15px] font-extrabold text-ink shadow-[5px_5px_0_0_#6ac6ff] transition-transform hover:-translate-y-1"
            >
              Start a collab →
            </a>
            <a
              href="#partners"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-[3px] border-white/70 bg-transparent px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-white hover:text-ink"
            >
              See past collabs
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-1">
            {[
              [`${cuSubs}+`, "subscribers on Counting Unique"],
              [COUNTING_UNIQUE.views28d, "views in the last 28 days"],
              ["50+", "brand campaigns delivered"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 px-3 py-4 text-white backdrop-blur-md sm:px-5"
                style={{
                  boxShadow: `4px 4px 0 0 ${
                    i === 0 ? "#6AC6FF" : i === 1 ? "#FFFFFF" : "#FFD23F"
                  }`,
                }}
              >
                <dt className="font-display text-2xl font-extrabold leading-none tracking-tight sm:text-4xl">
                  {value}
                </dt>
                <dd className="mt-1.5 text-[11px] font-semibold leading-tight text-white/70 sm:text-[13px]">
                  {label}
                </dd>
              </div>
            ))}
            {/* Extra commercial context */}
            <div
              className="rounded-2xl border border-white/20 bg-white/10 px-3 py-4 text-white backdrop-blur-md sm:px-5"
              style={{ boxShadow: "4px 4px 0 0 #FF6B35" }}
            >
              <dt className="font-display text-2xl font-extrabold leading-none tracking-tight sm:text-4xl">
                85%
              </dt>
              <dd className="mt-1.5 text-[11px] font-semibold leading-tight text-white/70 sm:text-[13px]">
                18–34 age demographic
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

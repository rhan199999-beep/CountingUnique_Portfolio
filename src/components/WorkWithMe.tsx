import { COUNTING_UNIQUE, WHATSAPP_CHANNEL } from "@/data/channels";
import { PARTNERS } from "@/data/partners";
import Reveal from "./Reveal";

/**
 * The dedicated brand / collaborator path. Real, contextual numbers only —
 * subscriber count, recent views and the actual number of logged collabs.
 */
export default function WorkWithMe({ cuSubs }: { cuSubs: string }) {
  return (
    <section
      id="work"
      className="scroll-mt-24 border-y-2 border-ink bg-brand text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-12">
        <Reveal>
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[15px]">
            Brands &amp; Collaborators
          </p>
          <h2 className="font-display mt-2 max-w-[18ch] text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Give me something{" "}
            <span className="inline-block -rotate-1 rounded-xl border-[3px] border-ink bg-white px-2 text-ink shadow-[4px_4px_0_0_#08243f]">
              worth filming.
            </span>
          </h2>
          <p className="font-display mt-5 max-w-[52ch] text-lg font-semibold leading-snug tracking-tight text-white/85 sm:text-xl">
            Long-form experiments, dedicated tests, Shorts and vlogs. If your
            product can survive a real-world situation, it makes a better film
            than an ad read.
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
              [String(PARTNERS.length), "brand collaborations"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className="rounded-2xl border-[3px] border-ink bg-white px-3 py-4 text-ink sm:px-5"
                style={{
                  boxShadow: `4px 4px 0 0 ${
                    i === 0 ? "#6AC6FF" : i === 1 ? "#FFFFFF" : "#08243f"
                  }`,
                }}
              >
                <dt className="font-display text-2xl font-extrabold leading-none tracking-tight sm:text-4xl">
                  {value}
                </dt>
                <dd className="mt-1.5 text-[11px] font-semibold leading-tight text-ink/65 sm:text-[13px]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import { COUNTING_UNIQUE, CU_AVATAR, PRANAY_AVATAR } from "@/data/channels";
import { categoriesFor, categoryBySlug } from "@/lib/categories";
import { thumb, watchUrl, type FeedVideo } from "@/lib/youtube";
import Parallax from "./Parallax";
import VideoPreview from "./VideoPreview";

/** Channel identity chips for the hero — avatars only, never the logos. */
const CHANNEL_AVATARS: {
  src: string;
  name: string;
  /** Optional funky accent — marker-styled label. */
  funky?: boolean;
}[] = [
  { src: CU_AVATAR, name: "Counting Unique" },
  { src: PRANAY_AVATAR, name: "Saypranay" },
];

/**
 * Video-first hero: who Pranay is, what he makes, and the newest upload as
 * the visual centrepiece — all above the fold on a 375px phone.
 */
export default function Hero({
  cuSubs,
  pgSubs,
  latest,
  duration,
}: {
  cuSubs: string;
  pgSubs: string;
  latest?: FeedVideo;
  duration?: string;
}) {
  const category = latest
    ? categoryBySlug(categoriesFor(latest.title, "cu")[0])
    : null;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-frost">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(#0e69b420 1.4px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[420px] w-[420px] rounded-full bg-sky/35 blur-3xl lg:block"
      />

      <div className="relative mx-auto grid max-w-6xl gap-7 px-5 pt-6 pb-10 sm:gap-10 sm:px-8 sm:pt-12 sm:pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:px-12 lg:pt-16 lg:pb-20">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {CHANNEL_AVATARS.map((c) => (
              <span
                key={c.name}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-ink bg-white px-2 shadow-[2px_2px_0_0_#08243f] transition-transform duration-200 hover:-translate-y-1.5 sm:h-10 sm:px-2.5"
              >
                <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/40 bg-white sm:h-6 sm:w-6">
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </span>
                <span
                  className={`flex items-center gap-1 font-display text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink sm:text-[11px] ${c.funky ? "marker-brand" : ""}`}
                >
                  <span aria-hidden className="text-brand">▶</span>
                  {c.name}
                </span>
              </span>
            ))}
          </div>

          <h1
            className="font-display mt-4 min-h-[9.5625rem] text-balance text-[2.5rem] font-extrabold leading-[0.95] tracking-tight text-ink min-[360px]:min-h-[7.25rem] min-[430px]:min-h-[5rem] sm:mt-5 sm:min-h-[7.25rem] sm:text-6xl lg:min-h-[16.375rem] lg:text-[4.35rem]"
          >
            Hey, I&apos;m{" "}
            <span className="mr-1 inline-block -rotate-2 rounded-2xl border-[3px] border-ink bg-brand px-2.5 text-white shadow-[4px_4px_0_0_#08243f] sm:px-3">
              Pranay.
            </span>{" "}
            I film the{" "}
            <span className="marker-sky">unbelievable.</span>
          </h1>

          <p
            className="font-display mt-4 max-w-[46ch] text-[16px] font-semibold leading-snug tracking-tight text-ink/80 sm:mt-5 sm:text-xl"
          >
            Long experiments on{" "}
            <strong className="font-display font-extrabold text-ink">Counting Unique</strong>.
            Shorts and vlogs on{" "}
            <strong className="font-display font-extrabold text-ink">Saypranay</strong>. If it
            sounds too crazy to be true, I&apos;ve probably already filmed it.
          </p>

          <div
            className="rise-in mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:items-center sm:gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <a
              href={latest ? watchUrl(latest.id) : COUNTING_UNIQUE.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-action px-3 text-[14px] font-extrabold text-ink shadow-[5px_5px_0_0_#08243f] transition-transform hover:-translate-y-1 hover:rotate-1 focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-2.5 sm:px-7 sm:text-[16px]"
            >
              <span aria-hidden className="text-[12px] sm:text-[13px]">▶</span>
              <span className="sm:hidden">Watch latest</span>
              <span className="hidden sm:inline">Watch latest video</span>
            </a>
            <a
              href={COUNTING_UNIQUE.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border-[3px] border-ink bg-white px-3 text-[13px] font-extrabold text-ink shadow-[4px_4px_0_0_#0e69b4] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6 sm:text-[15px]"
            >
              Subscribe · {cuSubs}+
            </a>
          </div>

          <dl
            className="mt-8 hidden flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-ink/10 pt-5 sm:flex"
          >
            {[
              [`${cuSubs}+`, "on Counting Unique"],
              [`${pgSubs}+`, "on Saypranay"],
            ].map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  {value}
                </dt>
                <dd className="text-[12px] font-medium leading-tight text-ink/65 sm:text-[13px]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Parallax strength={16} className="min-w-0">
          {latest ? (
            <a
              href={watchUrl(latest.id)}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-[1.4rem] border-[3px] border-ink bg-ink shadow-[9px_9px_0_0_#0e69b4] transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="relative block aspect-video overflow-hidden rounded-t-[1.15rem]">
                <VideoPreview
                  id={latest.id}
                  title={latest.title}
                  src={thumb(latest.id)}
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  priority
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 -rotate-2 rounded-lg border-2 border-ink bg-sky px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-ink shadow-[2px_2px_0_0_#08243f]">
                  Latest drop
                </span>
                {duration ? (
                  <span className="absolute bottom-3 right-3 rounded-md border border-white/30 bg-ink/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                    {duration}
                  </span>
                ) : null}
                <span
                  aria-hidden
                  className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 bg-brand text-lg text-white shadow-[0_0_0_6px_rgba(8,36,63,0.22)] transition-transform duration-300 group-hover:scale-110"
                >
                  ▶
                </span>
              </span>
              <span className="block p-5 sm:p-6">
                <span className="flex flex-wrap items-center gap-2">
                  {category ? (
                    <span
                      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-[2px_2px_0_0_#08243f] ${category.chip}`}
                    >
                      {category.label}
                    </span>
                  ) : null}
                </span>
                <span className="font-display mt-2.5 line-clamp-2 block text-xl font-extrabold leading-tight text-white sm:text-2xl">
                  {latest.title}
                </span>
                <span className="mt-1.5 block text-[13px] font-medium text-white/55">
                  Counting Unique · hover to preview
                </span>
              </span>
            </a>
          ) : (
            <div className="overflow-hidden rounded-[1.4rem] border-[3px] border-ink bg-ink shadow-[9px_9px_0_0_#0e69b4]">
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-t-[1.15rem] bg-ink px-6 text-center">
                <p className="font-display text-2xl font-extrabold text-white">
                  The latest upload is on its way.
                </p>
                <p className="text-sm text-white/55">
                  YouTube&apos;s feed refreshes hourly.
                </p>
              </div>
              <div className="p-5">
                <a
                  href={COUNTING_UNIQUE.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-sky underline decoration-2 underline-offset-4"
                >
                  Open Counting Unique on YouTube ↗
                </a>
              </div>
            </div>
          )}
        </Parallax>
      </div>
    </section>
  );
}

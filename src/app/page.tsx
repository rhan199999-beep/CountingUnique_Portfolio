import Image from "next/image";
import Hero from "@/components/Hero";
import VideoTabs from "@/components/VideoTabs";
import Partners from "@/components/Partners";
import Analytics from "@/components/Analytics";
import Reveal from "@/components/Reveal";
import { getChannelSnapshot, getChannelStats, getLatestVideos } from "@/lib/youtube";
import {
  COUNTING_UNIQUE,
  PRANAY_GUPTA,
  CU_AVATAR,
  PERIOD_LABEL,
} from "@/data/channels";

const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VaBLucwHQbRvDBsxOh2Y";

export default async function Home() {
  // Independent fetches in parallel — no waterfalls.
  // Live totals via Data API when YT_API_KEY is set; otherwise the
  // scrape/seed fallbacks below keep the page rendering.
  const [cuSnap, pgSnap, cuVideos, pgVideos, cuStats, pgStats] = await Promise.all([
    getChannelSnapshot(COUNTING_UNIQUE.url, COUNTING_UNIQUE.handle, {
      subs: COUNTING_UNIQUE.fallbackSubs,
      videos: COUNTING_UNIQUE.fallbackVideos,
      live: false,
    }),
    getChannelSnapshot(PRANAY_GUPTA.url, PRANAY_GUPTA.handle, {
      subs: PRANAY_GUPTA.fallbackSubs,
      videos: PRANAY_GUPTA.fallbackVideos,
      live: false,
    }),
    getLatestVideos(COUNTING_UNIQUE.channelId),
    getLatestVideos(PRANAY_GUPTA.channelId),
    getChannelStats(COUNTING_UNIQUE.channelId, process.env.YT_API_KEY),
    getChannelStats(PRANAY_GUPTA.channelId, process.env.YT_API_KEY),
  ]);
  const cuSubs = cuStats?.subs ?? cuSnap.subs;
  const pgSubs = pgStats?.subs ?? pgSnap.subs;
  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Pranay Gupta",
            alternateName: ["Counting Unique", "@saypranay"],
            jobTitle: "YouTuber",
            sameAs: [COUNTING_UNIQUE.url, PRANAY_GUPTA.url, WHATSAPP_CHANNEL],
          }),
        }}
      />
      <Hero pgSubs={pgSubs} />

      <section id="about" className="mx-auto max-w-6xl scroll-mt-20 bg-paper px-5 py-14 sm:px-8 lg:px-12">
        <Reveal>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div>
            <h2 className="font-display mt-2 text-5xl leading-[0.9] font-extrabold tracking-tight text-ink sm:text-6xl">
              About{" "}
              <span className="inline-block -rotate-2 rounded-xl border-[3px] border-ink bg-[#FFD23F] px-2 shadow-[4px_4px_0_0_#0f0f0f]">
                Me
              </span>
            </h2>
            <div className="mt-6 max-w-[360px] rotate-2 rounded-2xl border-2 border-ink bg-white p-2 shadow-[5px_5px_0_0_#0f0f0f] transition-transform hover:rotate-0">
              <Image
                src={CU_AVATAR}
                alt="Counting Unique channel photo"
                width={512}
                height={512}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            </div>
          </div>
          <div className="max-w-[62ch]">
            <p className="text-[18px] font-medium leading-relaxed text-ink/85">
              My name is Pranay Gupta. I run two YouTube channels:{" "}
              <span className="inline-block -rotate-1 rounded-lg border-2 border-ink bg-[#FFD23F] px-2 font-extrabold text-ink shadow-[3px_3px_0_0_#0f0f0f]">
                Counting Unique
              </span>{" "}
              ({cuSubs} subscribers) for long experiments and reality
              checks, and{" "}
              <span className="marker-sky font-extrabold text-ink">@saypranay</span>{" "}
              ({pgSubs} subscribers) for Shorts and vlogs.
            </p>
            <p className="mt-4 text-[18px] font-medium leading-relaxed text-ink/85">
              I take crazy ideas seriously — testing them on camera so you
              don&apos;t have to. If it&apos;s unbelievable, I&apos;ve probably
              already filmed it.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rotate-1 rounded-2xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_#0f0f0f]">
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  {cuSubs}
                </p>
                <p className="mt-1 text-[14px] font-semibold text-ink/60">
                  Counting Unique subs
                </p>
              </div>
              <div className="-rotate-1 rounded-2xl border-2 border-ink bg-ink p-4 shadow-[4px_4px_0_0_#62c3ff]">
                <p className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {pgSubs}
                </p>
                <p className="mt-1 text-[14px] font-semibold text-white/60">
                  @saypranay subs
                </p>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      <section id="channels" className="scroll-mt-20 border-b-2 border-ink">        <div className="grid md:grid-cols-2">
          <article className="border-b-2 border-ink px-5 py-12 sm:px-8 md:border-b-0 md:border-r-2 lg:px-12">
            <div className="mx-auto max-w-xl md:ml-auto md:mr-0">
              <p className="text-[15px] text-ink/60">Long-form experiments · {COUNTING_UNIQUE.handle}</p>
              <p className="font-display mt-3 text-6xl tracking-tight text-ink sm:text-7xl">
                {cuSubs}
              </p>
              <p className="mt-1 text-[15px] font-medium text-ink">subscribers on Counting Unique</p>
              <dl className="mt-8 space-y-3 border-t-2 border-ink pt-6">
                {(
                  [
                    [COUNTING_UNIQUE.views28d, "views in the last 28 days"],
                    [COUNTING_UNIQUE.watchHours28d, "watch hours in the last 28 days"],
                    [`${COUNTING_UNIQUE.avgViewDuration} average watch`, "per view, long-form"],
                    ...(cuStats ? [[`${cuStats.views} total views`, "lifetime · updates hourly"] as [string, string]] : []),
                  ] as [string, string][]
                ).map(([v, l]) => (
                  <div key={l} className="flex items-baseline justify-between gap-4">
                    <dd className="font-display text-2xl text-ink">{v}</dd>
                    <dt className="text-right text-[14px] text-ink/60">{l}</dt>
                  </div>
                ))}
              </dl>
              <a
                href={COUNTING_UNIQUE.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-brand"
              >
                Open channel →
              </a>
            </div>
          </article>

          <article className="bg-ink px-5 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-xl md:ml-0 md:mr-auto">
              <p className="text-[15px] text-white/60">Shorts + vlogs · {PRANAY_GUPTA.handle}</p>
              <p className="font-display mt-3 text-6xl tracking-tight sm:text-7xl">
                {pgSubs}
              </p>
              <p className="mt-1 text-[15px] font-medium text-white">subscribers on Pranay Gupta</p>
              <dl className="mt-8 space-y-3 border-t-2 border-white/25 pt-6">
                {(
                  [
                    [PRANAY_GUPTA.shortsViews28d, "Shorts views in the last 28 days"],
                    [PRANAY_GUPTA.monthlyAudience, "monthly audience"],
                    [PRANAY_GUPTA.subsGained28d, "new subscribers in 28 days"],
                    ...(pgStats ? [[`${pgStats.views} total views`, "lifetime · updates hourly"] as [string, string]] : []),
                  ] as [string, string][]
                ).map(([v, l]) => (
                  <div key={l} className="flex items-baseline justify-between gap-4">
                    <dd className="font-display text-2xl">{v}</dd>
                    <dt className="text-right text-[14px] text-white/60">{l}</dt>
                  </div>
                ))}
              </dl>
              <a
                href={PRANAY_GUPTA.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white hover:opacity-90"
              >
                Subscribe →
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="latest" className="dots-bg-light scroll-mt-20 border-t-2 border-ink bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
          <Reveal>
          <p className="inline-block rotate-2 rounded-lg border-2 border-sky bg-sky px-3 py-1 font-mono text-[13px] text-ink">
            AUTO-UPDATING · HOURLY
          </p>
          <h2 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">
            Fresh off <span className="text-sky">YouTube</span>
          </h2>
          <p className="mt-3 max-w-[62ch] leading-relaxed text-white/70">
            Whatever went up last, lands here first. Switch tabs to jump
            between the two channels.
          </p>
          </Reveal>
          <div className="mt-8">
            <VideoTabs cuVideos={cuVideos} pgVideos={pgVideos} />
          </div>
        </div>
      </section>

      <Analytics />

      <Partners />

      <footer id="contact" className="scroll-mt-20 overflow-hidden bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <a
                href={COUNTING_UNIQUE.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white hover:opacity-90"
              >
                Counting Unique on YouTube
              </a>
              <a
                href={PRANAY_GUPTA.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/30 px-6 text-[15px] font-medium text-white hover:bg-white/10"
              >
                @saypranay
              </a>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/30 px-6 text-[15px] font-medium text-white hover:bg-white/10"
              >
                WhatsApp channel
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>Counting Unique™ · Pranay Gupta</p>
          </div>
          <p aria-hidden className="font-display -mb-6 mt-8 select-none text-center text-[19vw] font-bold leading-[0.8] tracking-tight text-white/[0.07] lg:text-[15rem]">
            PRANAY
          </p>
        </div>
      </footer>
    </main>
  );
}

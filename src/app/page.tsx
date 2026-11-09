import Image from "next/image";
import Hero from "@/components/Hero";
import VideoTabs from "@/components/VideoTabs";
import WorkWithMe from "@/components/WorkWithMe";
import Partners from "@/components/Partners";
import Analytics from "@/components/Analytics";
import Reveal from "@/components/Reveal";
import StickyCTA from "@/components/StickyCTA";
import {
  getChannelSnapshot,
  getChannelStats,
  getLatestVideos,
  getVideoDurations,
} from "@/lib/youtube";
import { getStudioData } from "@/lib/studio";
import {
  COUNTING_UNIQUE,
  PRANAY_GUPTA,
  CU_AVATAR,
  WHATSAPP_CHANNEL,
} from "@/data/channels";

export const revalidate = 3600;

export default async function Home() {
  // Independent fetches in parallel — no waterfalls.
  // Live totals via Data API when YT_API_KEY is set; otherwise the
  // scrape/seed fallbacks below keep the page rendering.
  // The page is statically rendered and revalidated hourly, so the first
  // byte is instant and the YouTube calls happen once per revalidation.
  const [cuSnap, pgSnap, cuVideos, pgVideos, cuStats, pgStats, cuStudio, pgStudio] =
    await Promise.all([
      getChannelSnapshot(COUNTING_UNIQUE.url, COUNTING_UNIQUE.handle, {
        subs: COUNTING_UNIQUE.fallbackSubs,
        videos: COUNTING_UNIQUE.fallbackVideos,
        live: false,
      }, COUNTING_UNIQUE.channelId),
      getChannelSnapshot(PRANAY_GUPTA.url, PRANAY_GUPTA.handle, {
        subs: PRANAY_GUPTA.fallbackSubs,
        videos: PRANAY_GUPTA.fallbackVideos,
        live: false,
      }, PRANAY_GUPTA.channelId),
      getLatestVideos(COUNTING_UNIQUE.channelId),
      getLatestVideos(PRANAY_GUPTA.channelId),
      getChannelStats(COUNTING_UNIQUE.channelId, process.env.YT_API_KEY),
      getChannelStats(PRANAY_GUPTA.channelId, process.env.YT_API_KEY),
      getStudioData("cu"),
      getStudioData("pg"),
    ]);

  const cuSubs = cuStats?.subs ?? cuSnap.subs;
  const pgSubs = pgStats?.subs ?? pgSnap.subs;
  const initialTab = "cu" as const;
  const latest = cuVideos[0];
  const durations = await getVideoDurations(
    [...cuVideos, ...pgVideos].map((video) => video.id)
  );

  return (
    <main id="top" className="pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Pranay Gupta",
            alternateName: ["Counting Unique", "Saypranay"],
            jobTitle: "YouTuber",
            sameAs: [COUNTING_UNIQUE.url, PRANAY_GUPTA.url, WHATSAPP_CHANNEL],
          }),
        }}
      />

      <Hero
        cuSubs={cuSubs}
        pgSubs={pgSubs}
        latest={latest}
        duration={latest ? durations[latest.id] : undefined}
      />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div
          id="about"
          className="scroll-mt-24 grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14"
        >
          <Reveal>
            <div className="relative mx-auto w-full max-w-[330px]">
              <div className="rotate-2 rounded-[1.6rem] border-[3px] border-ink bg-white p-2 shadow-[8px_8px_0_0_#6ac6ff]">
                <Image
                  src={CU_AVATAR}
                  alt="Counting Unique channel profile photo"
                  width={512}
                  height={512}
                  loading="lazy"
                  className="aspect-square w-full rounded-[1.2rem] object-cover"
                />
              </div>
              <span className="absolute -bottom-3 -right-2 -rotate-2 rounded-lg border-2 border-ink bg-action px-3 py-1 font-mono text-[12px] font-bold text-ink shadow-[3px_3px_0_0_#08243f]">
                Pranay Gupta
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display mt-2 text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Two Channels. One Rule.
              <span className="marker-sky block">Film The Crazy Idea.</span>
            </h2>
            <p className="font-display mt-5 max-w-[58ch] text-lg font-semibold leading-snug tracking-tight text-ink/75 sm:text-xl">
              On{" "}
              <strong className="font-extrabold text-ink">Counting Unique</strong>{" "}
              I run long experiments and reality checks — the kind of idea that
              sounds ridiculous until you watch it happen. On{" "}
              <strong className="font-extrabold text-ink">Saypranay</strong> I make
              Shorts and vlogs from the same chaotic ideas.
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink/60">
              I take crazy ideas seriously, testing them on camera. So you
              don&apos;t have to. If it is unbelievable I already filmed it.
            </p>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="group/link mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-ink transition-colors hover:text-brand"
            >
              Get new uploads on WhatsApp
              <span aria-hidden className="transition-transform group-hover/link:translate-x-1">
                →
              </span>
            </a>
          </Reveal>
        </div>

        <div
          id="channels"
          className="scroll-mt-24 mt-12 grid gap-4 md:grid-cols-2"
        >
          <Reveal>
            <a
              href={COUNTING_UNIQUE.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-[6px_6px_0_0_#0e69b4] transition-transform hover:-translate-y-1 sm:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
                    {COUNTING_UNIQUE.handle}
                  </p>
                  <span className="rounded-full border-2 border-ink bg-sky px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
                    Long-form
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                    {cuSubs}+
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded-full border-2 border-ink bg-brand px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-ink shadow-[3px_3px_0_0_#08243f]">
                    Counting Unique
                  </span>
                </div>
                {/* Stats row */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 rounded-xl bg-brand/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                      {COUNTING_UNIQUE.views28d}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink/50">
                      views
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-brand/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                      {COUNTING_UNIQUE.watchHours28d}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink/50">
                      watch hours
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-brand/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                      28d
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink/50">
                      window
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end">
                <span className="font-display shrink-0 text-[15px] font-extrabold text-ink group-hover:text-brand">
                  Open ↗
                </span>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={PRANAY_GUPTA.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between rounded-3xl bg-ink p-6 text-white shadow-[6px_6px_0_0_#6ac6ff] transition-transform hover:-translate-y-1 sm:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                    {PRANAY_GUPTA.handle}
                  </p>
                  <span className="rounded-full border-2 border-white/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white/80">
                    Shorts + vlogs
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                    {pgSubs}+
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_0_#62C3FF]">
                    Saypranay
                  </span>
                </div>
                {/* Stats row */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-white">
                      {PRANAY_GUPTA.shortsViews28d}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
                      shorts views
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-white">
                      {PRANAY_GUPTA.subsGained28d}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
                      new subs
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center">
                    <p className="font-display text-xl font-extrabold tracking-tight text-white">
                      28d
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
                      window
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end">
                <span className="font-display shrink-0 text-[15px] font-extrabold text-white group-hover:text-sky">
                  Open ↗
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      <section
        id="latest"
        className="dots-bg-light scroll-mt-24 border-y-2 border-ink bg-ink text-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-sky">
                Fresh off YouTube
              </p>
              <h2 className="font-display mt-1.5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                The library.
              </h2>
            </div>
          </div>
          <div className="mt-7">
            <VideoTabs
              cuVideos={cuVideos}
              pgVideos={pgVideos}
              initialTab={initialTab}
              durations={durations}
            />
            {/* Static page + CSS-only tabs can still deep-link ?channel=pg.
                Runs while the radios above are already parsed, so there is
                no visible switch after hydration. */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'try{if(new URLSearchParams(location.search).get("channel")==="pg"){var t=document.getElementById("tab-pg");if(t)t.checked=true}}catch(e){}',
              }}
            />
          </div>
        </div>
      </section>

      <WorkWithMe cuSubs={cuSubs} />

      <Partners />

      <Analytics cu={cuStudio} pg={pgStudio} />

      <footer id="contact" className="scroll-mt-24 overflow-hidden bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 lg:px-12">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-sky">
            Keep watching
          </p>
          <h2 className="font-display mt-2 max-w-[20ch] text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl">
            If it&apos;s unbelievable, I&apos;ve already filmed it.
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={COUNTING_UNIQUE.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand px-6 text-[15px] font-extrabold text-white shadow-[4px_4px_0_0_#6ac6ff] transition-transform hover:-translate-y-0.5"
            >
              Counting Unique on YouTube
            </a>
            <a
              href={PRANAY_GUPTA.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/30 px-6 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              Saypranay
            </a>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/30 px-6 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              WhatsApp channel
            </a>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>Counting Unique™ · Pranay Gupta</p>
            <p>Built around the uploads, not the resume.</p>
          </div>
        </div>
      </footer>

      <StickyCTA latestId={latest?.id} />
    </main>
  );
}

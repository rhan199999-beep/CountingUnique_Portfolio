"use client";

import { useState } from "react";
import Image from "next/image";
import { thumb, watchUrl, type FeedVideo } from "@/lib/youtube";
import { COUNTING_UNIQUE, PRANAY_GUPTA, TOP_VIDEOS } from "@/data/channels";

function formatDate(published: string): string {
  if (!published) return "YouTube";
  return new Date(published).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PlayButton({ big }: { big?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 m-auto flex items-center justify-center rounded-full bg-accent text-white opacity-95 transition-transform duration-300 group-hover:scale-110 ${
        big ? "h-16 w-16 text-xl" : "h-12 w-12 text-sm"
      }`}
    >
      ▶
    </span>
  );
}

function Thumb({ video, eager }: { video: FeedVideo; eager?: boolean }) {
  return (
    <span className="block aspect-video w-full overflow-hidden bg-ink">
      <span className="relative block h-full w-full">
        <Image
          src={thumb(video.id)}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading={eager ? undefined : "lazy"}
          draggable={false}
        />
      </span>
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-current px-2 py-0.5 font-mono text-[12px] opacity-70">
      {children}
    </span>
  );
}

function VideoCard({ video, channel }: { video: FeedVideo; channel: string }) {
  return (
    <a
      href={watchUrl(video.id)}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-white/20 bg-paper transition-all duration-200 hover:-translate-y-1 hover:border-white/50"
    >
      <span className="relative block">
        <Thumb video={video} />
        <PlayButton />
      </span>
      <span className="block min-w-0 flex-1 p-4">
        <span className="flex flex-wrap gap-1.5 text-ink">
          <Tag>{channel}</Tag>
          <Tag>{formatDate(video.published)}</Tag>
        </span>
        <span className="mt-2 line-clamp-2 block text-[15px] font-medium leading-snug text-ink">
          {video.title}
        </span>
        {video.description ? (
          <span className="mt-1 line-clamp-2 block text-[14px] font-medium leading-relaxed text-ink/80">
            {video.description}
          </span>
        ) : null}
      </span>
    </a>
  );
}

export default function VideoTabs({
  cuVideos,
  pgVideos,
}: {
  cuVideos: FeedVideo[];
  pgVideos: FeedVideo[];
}) {
  const [tab, setTab] = useState<"cu" | "pg">("cu");
  const active = tab === "cu" ? cuVideos : pgVideos;
  const channel = tab === "cu" ? COUNTING_UNIQUE : PRANAY_GUPTA;

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Channels" className="flex flex-wrap gap-2">
        {(
          [
            { id: "cu", label: "Counting Unique" },
            { id: "pg", label: "Pranay Gupta" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex min-h-[44px] items-center rounded-full px-5 text-[15px] font-medium transition-all ${
              tab === t.id
                ? "bg-white text-ink shadow-[3px_3px_0_0_#62c3ff]"
                : "border border-white/30 text-white hover:border-white/60 hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active.length > 0 ? (
        <div className="min-w-0">
          <a
            href={watchUrl(active[0].id)}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border-2 border-white/90 bg-paper shadow-[6px_6px_0_0_#62c3ff] lg:grid-cols-[1.2fr_1fr]"
          >
            <span className="relative block min-w-0">
              <Thumb video={active[0]} eager />
              <PlayButton big />
            </span>
            <span className="flex min-w-0 flex-col justify-center gap-2 border-t-2 border-white/90 p-6 sm:p-8 lg:border-l-2 lg:border-t-0">
              <span className="font-mono text-[13px] text-brand">LATEST DROP</span>
              <span className="font-display block text-2xl leading-tight text-ink sm:text-3xl">
                {active[0].title}
              </span>
              {active[0].description ? (
                <span className="line-clamp-3 block text-[15px] font-medium leading-relaxed text-ink/80">
                  {active[0].description}
                </span>
              ) : null}
              <span className="mt-1 flex flex-wrap gap-1.5 text-ink">
                <Tag>{channel.name}</Tag>
                <Tag>{formatDate(active[0].published)}</Tag>
              </span>
            </span>
          </a>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.slice(1).map((v) => (
              <VideoCard key={v.id} video={v} channel={channel.name} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-white/70">
            Live feed unreachable right now — showing the top Studio titles
            instead. New uploads appear here automatically once the feed
            reconnects.
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_VIDEOS.map((v, i) => (
              <li
                key={v.title}
                className="rounded-2xl border border-ink/15 bg-paper p-5"
              >
                <p className="font-mono text-[13px] text-brand">
                  0{i + 1} · {v.views} views
                </p>
                <p className="mt-2 text-[15px] font-medium leading-snug text-ink">
                  {v.title}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <a
        href={channel.searchUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-[14px] font-medium text-white/70 underline decoration-sky decoration-2 underline-offset-4 hover:text-sky"
      >
        Browse everything from {channel.name} ↗
      </a>

      <a
        href={channel.url}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
      >
        Open {channel.name} on YouTube →
      </a>
    </div>
  );
}

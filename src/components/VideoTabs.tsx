import Image from "next/image";
import { thumb, watchUrl, type FeedVideo } from "@/lib/youtube";
import { COUNTING_UNIQUE, PRANAY_GUPTA } from "@/data/channels";

type Channel = {
  name: string;
  url: string;
  searchUrl: string;
};

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

function Tag({
  children,
  tone = "pop",
}: {
  children: React.ReactNode;
  tone?: "pop" | "dark";
}) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide shadow-[2px_2px_0_0_#0f0f0f] ${
        tone === "pop" ? "bg-[#FFD23F] text-ink" : "bg-ink text-white"
      }`}
    >
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
          <Tag tone="pop">{channel}</Tag>
          <Tag tone="dark">{formatDate(video.published)}</Tag>
        </span>
        <span className="mt-2 line-clamp-2 block text-[15px] font-medium leading-snug text-ink">
          {video.title}
        </span>
      </span>
    </a>
  );
}

function ChannelPanel({
  videos,
  channel,
}: {
  videos: FeedVideo[];
  channel: Channel;
}) {
  if (videos.length === 0) {
    return (
      <div className="max-w-[62ch]">
        <p className="text-[15px] leading-relaxed text-white/70">
          The live feed for {channel.name} is unreachable right now. New
          uploads appear here automatically once it reconnects.
        </p>
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
        >
          Open {channel.name} on YouTube →
        </a>
      </div>
    );
  }
  return (
    <div className="min-w-0">
      <a
        href={watchUrl(videos[0].id)}
        target="_blank"
        rel="noreferrer"
        className="group grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border-2 border-white/90 bg-paper shadow-[6px_6px_0_0_#62c3ff] lg:grid-cols-[1.2fr_1fr]"
      >
        <span className="relative block min-w-0">
          <Thumb video={videos[0]} eager />
          <PlayButton big />
        </span>
        <span className="flex min-w-0 flex-col justify-center gap-2 border-t-2 border-white/90 p-6 sm:p-8 lg:border-l-2 lg:border-t-0">
          <span className="font-mono text-[13px] text-brand">LATEST DROP</span>
          <span className="font-display block text-2xl leading-tight text-ink sm:text-3xl">
            {videos[0].title}
          </span>
          <span className="mt-1 flex flex-wrap gap-1.5 text-ink">
            <Tag tone="pop">{channel.name}</Tag>
            <Tag tone="dark">{formatDate(videos[0].published)}</Tag>
          </span>
        </span>
      </a>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.slice(1).map((v) => (
          <VideoCard key={v.id} video={v} channel={channel.name} />
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={channel.searchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center text-[14px] font-medium text-white/70 underline decoration-sky decoration-2 underline-offset-4 hover:text-sky"
        >
          Browse everything from {channel.name} ↗
        </a>
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
        >
          Open {channel.name} on YouTube →
        </a>
      </div>
    </div>
  );
}

/**
 * Channel tabs built on native radio inputs + pure CSS — switching tabs
 * only checks a radio button, so the page never reloads, never scrolls,
 * and works with JavaScript disabled. ?channel=pg pre-selects PG.
 */
export default function VideoTabs({
  cuVideos,
  pgVideos,
  initialTab,
}: {
  cuVideos: FeedVideo[];
  pgVideos: FeedVideo[];
  initialTab: "cu" | "pg";
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-3 border-0 p-0">
      <legend className="sr-only">Channels</legend>
      <input
        type="radio"
        name="latest-channel"
        id="tab-cu"
        defaultChecked={initialTab === "cu"}
        className="sr-only"
      />
      <label
        htmlFor="tab-cu"
        className="font-display tablabel-cu inline-flex min-h-[52px] -rotate-2 cursor-pointer items-center rounded-2xl border-[3px] border-white/30 bg-transparent px-6 text-lg font-extrabold tracking-tight text-white uppercase transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
      >
        Counting Unique
      </label>
      <input
        type="radio"
        name="latest-channel"
        id="tab-pg"
        defaultChecked={initialTab === "pg"}
        className="sr-only"
      />
      <label
        htmlFor="tab-pg"
        className="font-display tablabel-pg inline-flex min-h-[52px] rotate-2 cursor-pointer items-center rounded-2xl border-[3px] border-white/30 bg-transparent px-6 text-lg font-extrabold tracking-tight text-white uppercase transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
      >
        Pranay Gupta
      </label>
      <div className="panel-cu mt-6 hidden w-full">
        <ChannelPanel videos={cuVideos} channel={COUNTING_UNIQUE} />
      </div>
      <div className="panel-pg mt-6 hidden w-full">
        <ChannelPanel videos={pgVideos} channel={PRANAY_GUPTA} />
      </div>
    </fieldset>
  );
}

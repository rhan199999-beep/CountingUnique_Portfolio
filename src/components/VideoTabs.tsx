import { Fragment } from "react";
import { COUNTING_UNIQUE, PRANAY_GUPTA } from "@/data/channels";
import {
  CATEGORIES,
  categoriesFor,
  categoryBySlug,
  type CategorySlug,
} from "@/lib/categories";
import { thumb, watchUrl, type FeedVideo } from "@/lib/youtube";
import VideoPreview from "./VideoPreview";

type Channel = {
  key: "cu" | "pg";
  name: string;
  url: string;
  searchUrl: string;
};

const CU_CHANNEL: Channel = { ...COUNTING_UNIQUE, key: "cu" };
const PG_CHANNEL: Channel = { ...PRANAY_GUPTA, key: "pg" };

function Chip({
  children,
  tone = "pop",
}: {
  children: React.ReactNode;
  tone?: "pop" | "dark";
}) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-[2px_2px_0_0_#08243f] ${
        tone === "pop" ? "bg-sky text-ink" : "bg-ink text-white"
      }`}
    >
      {children}
    </span>
  );
}

function CategoryChip({ slug }: { slug: CategorySlug }) {
  const category = categoryBySlug(slug);
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-[2px_2px_0_0_#08243f] ${category.chip}`}
    >
      {category.label}
    </span>
  );
}

/** Large lead card for the newest upload in the active channel tab. */
function FeatureCard({
  video,
  channel,
  durations,
}: {
  video: FeedVideo;
  channel: Channel;
  durations: Record<string, string>;
}) {
  const cats = categoriesFor(video.title, channel.key);
  return (
    <a
      href={watchUrl(video.id)}
      target="_blank"
      rel="noreferrer"
      className={`video-card group grid min-w-0 overflow-hidden rounded-3xl border-[3px] border-white/80 bg-paper shadow-[6px_6px_0_0_#6ac6ff] transition-transform duration-300 hover:-translate-y-1 sm:grid-cols-[1.15fr_1fr] ${cats
        .map((slug) => `vcat-${slug}`)
        .join(" ")}`}
    >
      <span className="relative block aspect-video overflow-hidden sm:aspect-auto sm:min-h-[230px]">
        <VideoPreview
          id={video.id}
          title={video.title}
          src={thumb(video.id)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 -rotate-2 rounded-lg border-2 border-ink bg-sky px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-ink shadow-[2px_2px_0_0_#08243f]">
          Latest
        </span>
        {durations[video.id] ? (
          <span className="absolute bottom-3 right-3 rounded-md border border-white/30 bg-ink/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
            {durations[video.id]}
          </span>
        ) : null}
        <span
          aria-hidden
          className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 bg-brand text-base text-white transition-transform duration-300 group-hover:scale-110"
        >
          ▶
        </span>
      </span>
      <span className="flex min-w-0 flex-col justify-center gap-2 p-5 sm:p-6">
        <span className="font-display mt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-ink sm:text-[12px]">
          Newest on {channel.name}
        </span>
        <span className="font-display line-clamp-3 block text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-[1.7rem]">
          {video.title}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <CategoryChip slug={cats[0]} />
        </span>
      </span>
    </a>
  );
}

function VideoCard({
  video,
  channel,
  durations,
}: {
  video: FeedVideo;
  channel: Channel;
  durations: Record<string, string>;
}) {
  const cats = categoriesFor(video.title, channel.key);
  return (
    <a
      href={watchUrl(video.id)}
      target="_blank"
      rel="noreferrer"
      className={`video-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-white/20 bg-paper transition-all duration-200 hover:-translate-y-1 hover:border-white/50 ${cats
        .map((slug) => `vcat-${slug}`)
        .join(" ")}`}
    >
      <span className="relative block aspect-video overflow-hidden">
        <VideoPreview
          id={video.id}
          title={video.title}
          src={thumb(video.id)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        {durations[video.id] ? (
          <span className="absolute bottom-2.5 right-2.5 rounded-md border border-white/30 bg-ink/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
            {durations[video.id]}
          </span>
        ) : null}
        <span
          aria-hidden
          className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-brand text-xs text-white opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
        >
          ▶
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col p-4">
        <span className="flex flex-wrap items-center gap-1.5">
          <CategoryChip slug={cats[0]} />
        </span>
        <span className="font-display mt-2 line-clamp-2 block text-[15px] font-bold leading-snug text-ink">
          {video.title}
        </span>
      </span>
    </a>
  );
}

/**
 * Category filters. Native radios + sibling selectors hide non-matching
 * cards, so filtering is instant, needs no JavaScript, never reloads the
 * page and never moves the scroll position.
 */
function CategoryFilter({
  prefix,
  available,
}: {
  prefix: "cu" | "pg";
  available: CategorySlug[];
}) {
  return (
    <>
      <input
        type="radio"
        name={`filter-${prefix}`}
        id={`filter-${prefix}-all`}
        defaultChecked
        className="sr-only"
      />
      <label
        htmlFor={`filter-${prefix}-all`}
        className={`catlabel catlabel-${prefix}-all`}
      >
        All
      </label>
      {available.map((slug) => {
        const category = categoryBySlug(slug);
        return (
          <Fragment key={slug}>
            <input
              type="radio"
              name={`filter-${prefix}`}
              id={`filter-${prefix}-${slug}`}
              className="sr-only"
            />
            <label
              htmlFor={`filter-${prefix}-${slug}`}
              className={`catlabel catlabel-${prefix}-${slug}`}
            >
              {category.label}
            </label>
          </Fragment>
        );
      })}
    </>
  );
}

function ChannelPanel({
  videos,
  channel,
  durations,
}: {
  videos: FeedVideo[];
  channel: Channel;
  durations: Record<string, string>;
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
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-6 text-[15px] font-semibold text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
        >
          Open {channel.name} on YouTube →
        </a>
      </div>
    );
  }

  const available = CATEGORIES.map((c) => c.slug).filter((slug) =>
    videos.some((v) => categoriesFor(v.title, channel.key).includes(slug))
  );
  const [feature, ...rest] = videos;

  return (
    <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-2 border-0 p-0">
      <legend className="sr-only">
        Filter {channel.name} videos by category
      </legend>
      <CategoryFilter prefix={channel.key} available={available} />

      <div className={`video-stack-${channel.key} mt-5 w-full min-w-0`}>
        <FeatureCard video={feature} channel={channel} durations={durations} />
        {rest.length > 0 ? (
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                channel={channel}
                durations={durations}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-7 flex w-full flex-wrap items-center gap-4">
        <a
          href={channel.searchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-white/65 underline decoration-sky decoration-2 underline-offset-4 hover:text-sky"
        >
          Browse everything from {channel.name} ↗
        </a>
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-6 text-[14px] font-bold text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
        >
          Open {channel.name} on YouTube →
        </a>
      </div>
    </fieldset>
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
  durations,
}: {
  cuVideos: FeedVideo[];
  pgVideos: FeedVideo[];
  initialTab: "cu" | "pg";
  durations: Record<string, string>;
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
        style={{ position: "fixed", top: 0, left: 0 }}
      />
      <label
        htmlFor="tab-cu"
        className="font-display tablabel-cu inline-flex min-h-[48px] -rotate-2 cursor-pointer items-center rounded-2xl border-[3px] border-white/30 bg-transparent px-5 text-base font-extrabold tracking-tight text-white uppercase transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
      >
        Counting Unique
      </label>
      <input
        type="radio"
        name="latest-channel"
        id="tab-pg"
        defaultChecked={initialTab === "pg"}
        className="sr-only"
        style={{ position: "fixed", top: 0, left: 0 }}
      />
      <label
        htmlFor="tab-pg"
        className="font-display tablabel-pg inline-flex min-h-[48px] rotate-2 cursor-pointer items-center rounded-2xl border-[3px] border-white/30 bg-transparent px-5 text-base font-extrabold tracking-tight text-white uppercase transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
      >
        Pranay Gupta
      </label>
      <div className="panel-cu mt-6 hidden w-full min-w-0">
        <ChannelPanel
          videos={cuVideos}
          channel={CU_CHANNEL}
          durations={durations}
        />
      </div>
      <div className="panel-pg mt-6 hidden w-full min-w-0">
        <ChannelPanel
          videos={pgVideos}
          channel={PG_CHANNEL}
          durations={durations}
        />
      </div>
    </fieldset>
  );
}

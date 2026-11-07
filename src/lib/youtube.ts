/**
 * YouTube data layer — no API key required.
 *
 * - Channel IDs + fallback subscriber totals were resolved from the two
 *   channel links (verified Oct 2026). Live values are scraped from the
 *   public channel page HTML with a short timeout; on any failure the
 *   fallback seed renders with a "snapshot" label instead of breaking.
 * - Latest videos come from the public RSS feed per channel ID. The feeds
 *   endpoint is unreachable from some networks (verified failing here),
 *   so an empty list falls back to the curated Studio top-videos list.
 */

export type ChannelSnapshot = {
  subs: string;
  live: boolean;
  videos: string;
};

export type FeedVideo = {
  id: string;
  title: string;
  published: string;
  description: string;
};

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
};

function extractSubs(html: string, handle: string): string | null {
  // Anchor on the channel's own @handle, then read the nearby sub count.
  const anchor = html.indexOf(`"${handle}"`);
  if (anchor === -1) return null;
  const window = html.slice(anchor, anchor + 4000);
  const m = window.match(/([\d.,]+\s*[kmb])\s*subscribers/i);
  return m ? m[1].replace(/\s+/g, "") : null;
}

/**
 * YouTube embeds a schema.org ProfilePage block with the channel's own
 * follower count. Unlike the visible page — whose subscriber strings also
 * include the "recommended channels" rail — this block belongs to exactly
 * one channel, so the number can't be confused with someone else's.
 */
function parseChannelLdJson(
  html: string
): { subs: string; channelUrl?: string } | null {
  const blocks = html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  );
  for (const block of blocks) {
    const raw = block[1];
    if (!raw.includes("interactionStatistic")) continue;
    try {
      const data = JSON.parse(raw);
      const entity = data?.mainEntity ?? data;
      const stats: unknown[] = Array.isArray(entity?.interactionStatistic)
        ? entity.interactionStatistic
        : [];
      const follower = stats.find((entry) => {
        const counter = entry as {
          interactionType?: { "@type"?: string } | string;
        };
        const type =
          typeof counter?.interactionType === "string"
            ? counter.interactionType
            : counter?.interactionType?.["@type"];
        return type === "FollowAction" || type === "SubscribeAction";
      }) as { userInteractionCount?: string | number } | undefined;
      const count = Number(follower?.userInteractionCount);
      if (!Number.isFinite(count) || count <= 0) continue;
      return {
        subs: compact(count),
        channelUrl: typeof entity?.url === "string" ? entity.url : undefined,
      };
    } catch {
      continue;
    }
  }
  return null;
}

const SNAPSHOT_TTL_MS = 60 * 60 * 1000;
const snapshotCache = new Map<
  string,
  { value: ChannelSnapshot; expires: number }
>();

export async function getChannelSnapshot(
  pageUrl: string,
  handle: string,
  fallback: ChannelSnapshot,
  channelId?: string
): Promise<ChannelSnapshot> {
  // The channel page is ~2 MB, over Next's data-cache entry limit, so keep
  // a small in-process hourly cache instead of re-downloading it per request.
  const key = `${pageUrl}|${handle}`;
  const cached = snapshotCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.value;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(pageUrl, {
      headers: UA,
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return fallback;
    const html = await res.text();

    // Primary: schema.org block (exact channel, rounded the way YouTube
    // displays it). Guard against a redirect to a different channel.
    const parsed = parseChannelLdJson(html);
    if (parsed && (!channelId || parsed.channelUrl?.includes(channelId))) {
      const value: ChannelSnapshot = {
        subs: parsed.subs,
        videos: fallback.videos,
        live: true,
      };
      snapshotCache.set(key, { value, expires: Date.now() + SNAPSHOT_TTL_MS });
      return value;
    }

    // Fallback: the visible header text beside the handle (older layouts).
    const subs = extractSubs(html, handle);
    if (subs) {
      const value: ChannelSnapshot = {
        subs,
        videos: fallback.videos,
        live: true,
      };
      snapshotCache.set(key, { value, expires: Date.now() + SNAPSHOT_TTL_MS });
      return value;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export async function getLatestVideos(
  channelId: string,
  limit = 6
): Promise<FeedVideo[]> {
  const feed = await getFeedVideos(channelId, limit);
  if (feed.length > 0) return feed;
  // The RSS endpoint 404s from some networks (seen in the wild). The
  // channel's /videos tab carries the same first page, so parse that instead
  // rather than shipping a homepage with no videos.
  const page = await getChannelPageVideos(channelId, limit);
  return page;
}

async function getFeedVideos(
  channelId: string,
  limit: number
): Promise<FeedVideo[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: { ...UA, Accept: "application/atom+xml,application/xml" },
        signal: ctrl.signal,
        next: { revalidate: 3600 },
      }
    );
    clearTimeout(t);
    if (!res.ok) return [];
    const xml = await res.text();
    if (!xml.includes("<entry>")) return [];
    const entries = xml.split("<entry>").slice(1, limit + 1);
    return entries.flatMap((e) => {
      const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = e.match(/<title>([^<]+)<\/title>/)?.[1];
      const published = e.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      const rawDesc = e.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? "";
      const description = rawDesc
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160);
      return id && title
        ? [{ id, title: decodeEntities(title), published, description }]
        : [];
    });
  } catch {
    return [];
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

/**
 * Fallback source: the channel's public /videos tab. YouTube ships the first
 * page in the `ytInitialData` blob, so a single HTML parse yields the newest
 * uploads even when the RSS feed refuses to answer.
 */
async function getChannelPageVideos(
  channelId: string,
  limit: number
): Promise<FeedVideo[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(
      `https://www.youtube.com/channel/${channelId}/videos`,
      { headers: { ...UA, "Accept-Language": "en-US,en;q=0.9" }, signal: ctrl.signal }
    );
    clearTimeout(t);
    if (!res.ok) return [];
    const html = await res.text();
    const blob = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!blob) return [];

    const out: FeedVideo[] = [];
    const walk = (node: unknown) => {
      if (out.length >= limit || !node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        for (const item of node) walk(item);
        return;
      }
      const record = node as Record<string, unknown>;
      const lockup = record.lockupViewModel as Record<string, unknown> | undefined;
      if (lockup && typeof lockup.contentId === "string") {
        const meta = lockup.metadata as Record<string, unknown> | undefined;
        const metaVm = meta?.lockupMetadataViewModel as
          | Record<string, unknown>
          | undefined;
        const title = metaVm?.title as Record<string, unknown> | undefined;
        const text = typeof title?.content === "string" ? title.content : "";
        if (text) {
          out.push({
            id: lockup.contentId,
            title: decodeEntities(text),
            published: "",
            description: "",
          });
        }
        return;
      }
      for (const value of Object.values(record)) walk(value);
    };
    walk(JSON.parse(blob[1]));
    return out;
  } catch {
    return [];
  }
}

export function thumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** 16:9 poster frame for large hero/featured cards. */
export function thumbWide(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Reads the publish length of each video from YouTube's public player
 * endpoint. The endpoint responds with a few KB of JSON instead of the
 * ~1.3 MB watch page, so a dozen durations cost almost nothing and the
 * page's first byte stays fast. Failures are dropped, so a card simply
 * omits its duration chip.
 */
const PLAYER_API =
  "https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

export async function getVideoDurations(
  ids: string[]
): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  const pairs = await Promise.all(
    unique.map(async (id) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(PLAYER_API, {
          method: "POST",
          headers: { ...UA, "Content-Type": "application/json" },
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB",
                clientVersion: "2.20240101.00.00",
                hl: "en",
                gl: "IN",
              },
            },
            videoId: id,
          }),
          signal: ctrl.signal,
          next: { revalidate: 3600 },
        });
        clearTimeout(t);
        if (!res.ok) return null;
        const json = await res.json();
        const seconds = Number(json?.videoDetails?.lengthSeconds);
        if (!Number.isFinite(seconds) || seconds <= 0) return null;
        return [id, formatDuration(seconds)] as const;
      } catch {
        return null;
      }
    })
  );
  return Object.fromEntries(
    pairs.filter((p): p is readonly [string, string] => p !== null)
  );
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Live channel totals via YouTube Data API v3 (needs YT_API_KEY).
 * Costs 1 quota unit per channel; cached hourly. Returns null when no
 * key is set or the call fails so callers fall back to the scrape/seed.
 */
export type ChannelStats = {
  subs: string;
  views: string;
  videos: string;
};

function compact(n: string | number): string {
  const num = typeof n === "string" ? parseInt(n, 10) : n;
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
}

export async function getChannelStats(
  channelId: string,
  apiKey?: string
): Promise<ChannelStats | null> {
  if (!apiKey) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
      { signal: ctrl.signal, next: { revalidate: 3600 } }
    );
    clearTimeout(t);
    if (!res.ok) return null;
    const json = await res.json();
    const s = json?.items?.[0]?.statistics;
    if (!s) return null;
    return {
      subs: compact(s.subscriberCount),
      views: compact(s.viewCount),
      videos: compact(s.videoCount),
    };
  } catch {
    return null;
  }
}

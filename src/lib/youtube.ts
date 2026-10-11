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

function extractVideoCount(html: string, handle: string): string | null {
  const anchor = html.indexOf(`"${handle}"`);
  if (anchor === -1) return null;
  const window = html.slice(anchor, anchor + 4000);
  const m = window.match(/([\d,]+)\s*videos/i);
  return m ? m[1] : null;
}

export async function getChannelSnapshot(
  pageUrl: string,
  handle: string,
  fallback: ChannelSnapshot
): Promise<ChannelSnapshot> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(pageUrl, {
      headers: UA,
      signal: ctrl.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(t);
    if (!res.ok) return fallback;
    const html = await res.text();
    const subs = extractSubs(html, handle);
    const videos = extractVideoCount(html, handle);
    if (!subs) return fallback;
    return { subs, videos: videos ?? fallback.videos, live: true };
  } catch {
    return fallback;
  }
}

export async function getLatestVideos(
  channelId: string,
  limit = 6
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
      return id && title ? [{ id, title, published, description }] : [];
    });
  } catch {
    return [];
  }
}

export function thumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
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

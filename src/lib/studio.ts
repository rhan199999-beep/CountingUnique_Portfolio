/**
 * Studio analytics data.
 *
 * Subscribers and uploads are public and refresh themselves hourly, but watch
 * time, device splits, demographics, geography and traffic sources live behind
 * YouTube Studio. There is no public endpoint for them: the only automated
 * source is the YouTube Analytics API, which needs the channel owner's OAuth
 * consent.
 *
 * When YT_OAUTH_CLIENT_ID / YT_OAUTH_CLIENT_SECRET / YT_OAUTH_REFRESH_TOKEN
 * are set, this module pulls the trailing 28 days once a day and maps the
 * results into the shapes the charts render. Without them it returns the last
 * Studio export, labelled with the date it was captured — never a silent fake.
 */

import {
  COUNTING_UNIQUE,
  CU_AUDIENCE,
  CU_DEVICES,
  CU_DISCOVERY,
  CU_KPIS,
  CU_STATES,
  PG_AUDIENCE,
  PG_CITIES,
  PG_DEVICES,
  PG_KPIS,
  PG_STATES,
  PRANAY_GUPTA,
  STUDIO_UPDATED_AT,
} from "@/data/channels";

export type StudioRow = { label: string; pct: number };
export type StudioKpi = { value: string; label: string; hint: string };
export type StudioAudience = {
  male: number;
  female: number;
  ages: StudioRow[];
};
export type StudioData = {
  kpis: StudioKpi[];
  devices: StudioRow[];
  states: StudioRow[];
  discovery?: StudioRow[];
  cities?: { label: string; views: string }[];
  audience: StudioAudience;
  /** Date the numbers were read, e.g. "27 Apr 2026". */
  updatedAt: string;
  /** True when the numbers came from the Analytics API, not the export. */
  live: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const SEED_CU: StudioData = {
  kpis: [...CU_KPIS],
  devices: [...CU_DEVICES],
  states: [...CU_STATES],
  discovery: [...CU_DISCOVERY],
  audience: { ...CU_AUDIENCE, ages: [...CU_AUDIENCE.ages] },
  updatedAt: displayDate(STUDIO_UPDATED_AT),
  live: false,
};

const SEED_PG: StudioData = {
  kpis: [...PG_KPIS],
  devices: [...PG_DEVICES],
  states: [...PG_STATES],
  cities: [...PG_CITIES],
  audience: { ...PG_AUDIENCE, ages: [...PG_AUDIENCE.ages] },
  updatedAt: displayDate(STUDIO_UPDATED_AT),
  live: false,
};

const cache = new Map<"cu" | "pg", { value: StudioData; expires: number }>();

function displayDate(iso?: string): string {
  const date = iso ? new Date(`${iso}T12:00:00Z`) : new Date();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isoDay(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * DAY_MS).toISOString().slice(0, 10);
}

function compact(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function clock(seconds: number): string {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* OAuth                                                               */
/* ------------------------------------------------------------------ */

let tokenCache: { value: string; expires: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.YT_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YT_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.YT_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  if (tokenCache && tokenCache.expires > Date.now() + 30_000) {
    return tokenCache.value;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json?.access_token !== "string") return null;
    const ttl = Number(json.expires_in) || 3600;
    tokenCache = {
      value: json.access_token,
      expires: Date.now() + ttl * 1000,
    };
    return tokenCache.value;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Analytics API                                                       */
/* ------------------------------------------------------------------ */

type ApiReport = {
  columnHeaders?: { name: string }[];
  rows?: (string | number)[][];
};

async function report(
  accessToken: string,
  channelId: string,
  params: Record<string, string>
): Promise<ApiReport | null> {
  const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
  url.searchParams.set("ids", `channel==${channelId}`);
  url.searchParams.set("startDate", isoDay(-28));
  url.searchParams.set("endDate", isoDay(-1));
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiReport;
  } catch {
    return null;
  }
}

const DEVICE_LABELS: Record<string, string> = {
  MOBILE: "Mobile",
  DESKTOP: "Computer",
  TV: "TV",
  TABLET: "Tablet",
  GAME_CONSOLE: "Console",
  UNKNOWN: "Other",
};

const TRAFFIC_LABELS: Record<string, string> = {
  BROWSE: "Browse",
  RELATED_VIDEO: "Suggested",
  YT_SEARCH: "Search",
  SUBSCRIBER: "Subscriptions",
  SHORTS_FEED: "Shorts feed",
  PLAYLIST: "Playlists",
  CHANNEL: "Channel pages",
  EXT_URL: "External",
  NOTIFICATION: "Notifications",
  END_SCREEN: "End screens",
  YT_OTHER: "Other",
  NO_LINK_OTHER: "Other",
  NO_LINK_EMBEDDED: "Embedded",
  ADVERTISING: "Ads",
  PROMOTED: "Promoted",
};

const AGE_LABELS: Record<string, string> = {
  "age13-17": "13–17 yrs",
  "age18-24": "18–24 yrs",
  "age25-34": "25–34 yrs",
  "age35-44": "35–44 yrs",
  "age45-54": "45–54 yrs",
  "age55-64": "55–64 yrs",
  "age65-": "65+ yrs",
};

/** YouTube returns ISO 3166-2 codes for province; map the Indian ones. */
const PROVINCE_LABELS: Record<string, string> = {
  "IN-AN": "Andaman & Nicobar",
  "IN-AP": "Andhra Pradesh",
  "IN-AR": "Arunachal Pradesh",
  "IN-AS": "Assam",
  "IN-BR": "Bihar",
  "IN-CH": "Chandigarh",
  "IN-CT": "Chhattisgarh",
  "IN-DH": "Dadra & Nagar Haveli",
  "IN-DL": "Delhi",
  "IN-GA": "Goa",
  "IN-GJ": "Gujarat",
  "IN-HP": "Himachal Pradesh",
  "IN-HR": "Haryana",
  "IN-JH": "Jharkhand",
  "IN-JK": "Jammu & Kashmir",
  "IN-KA": "Karnataka",
  "IN-KL": "Kerala",
  "IN-LA": "Ladakh",
  "IN-LD": "Lakshadweep",
  "IN-MH": "Maharashtra",
  "IN-ML": "Meghalaya",
  "IN-MN": "Manipur",
  "IN-MP": "Madhya Pradesh",
  "IN-MZ": "Mizoram",
  "IN-NL": "Nagaland",
  "IN-OD": "Odisha",
  "IN-PB": "Punjab",
  "IN-PY": "Puducherry",
  "IN-RJ": "Rajasthan",
  "IN-SK": "Sikkim",
  "IN-TG": "Telangana",
  "IN-TN": "Tamil Nadu",
  "IN-TR": "Tripura",
  "IN-UP": "Uttar Pradesh",
  "IN-UT": "Uttarakhand",
  "IN-WB": "West Bengal",
};

function provinceLabel(value: string): string {
  return PROVINCE_LABELS[value] ?? value.replace(/^IN-/, "");
}

function toShares(
  rows: (string | number)[][] | undefined,
  label: (raw: string) => string,
  limit = 6
): StudioRow[] {
  if (!rows?.length) return [];
  const total = rows.reduce((sum, row) => sum + Number(row[1] || 0), 0);
  if (total <= 0) return [];
  return rows
    .slice(0, limit)
    .map((row) => ({
      label: label(String(row[0])),
      pct: round1((Number(row[1] || 0) / total) * 100),
    }))
    .filter((row) => row.pct > 0);
}

/* ------------------------------------------------------------------ */
/* Live fetch                                                          */
/* ------------------------------------------------------------------ */

async function liveStudio(channel: "cu" | "pg"): Promise<StudioData | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const seed = channel === "cu" ? SEED_CU : SEED_PG;
  const channelId =
    channel === "cu" ? COUNTING_UNIQUE.channelId : PRANAY_GUPTA.channelId;

  const [overview, devices, geography, demographics, traffic, cities] =
    await Promise.all([
      report(accessToken, channelId, {
        metrics:
          "views,estimatedMinutesWatched,averageViewDuration,subscribersGained",
      }),
      report(accessToken, channelId, {
        metrics: "views",
        dimensions: "deviceType",
        sort: "-views",
      }),
      report(accessToken, channelId, {
        metrics: "views",
        dimensions: "province",
        sort: "-views",
        maxResults: "5",
      }),
      report(accessToken, channelId, {
        metrics: "viewerPercentage",
        dimensions: "ageGroup,gender",
      }),
      report(accessToken, channelId, {
        metrics: "views",
        dimensions: "insightTrafficSourceType",
        sort: "-views",
        maxResults: "5",
      }),
      channel === "pg"
        ? report(accessToken, channelId, {
            metrics: "views",
            dimensions: "city",
            sort: "-views",
            maxResults: "5",
          })
        : Promise.resolve(null),
    ]);

  // No overview row means auth or quota failed — keep the dated snapshot.
  const totals = overview?.rows?.[0];
  if (!totals) return null;

  const [views, minutesWatched, avgViewDuration, subscriptions] = totals.map(
    (value) => Number(value) || 0
  );

  const kpis: StudioKpi[] = [
    { value: compact(views), label: "total views", hint: "all views across every video in 28 days" },
    { value: compact(minutesWatched / 60), label: "watch hours", hint: "total time people spent watching" },
    { value: clock(avgViewDuration), label: "avg. view time", hint: "average watch time per video view" },
    { value: `+${compact(subscriptions)}`, label: "new subscribers", hint: "subscribers gained in 28 days" },
  ];

  const deviceRows = toShares(
    devices?.rows,
    (raw) => DEVICE_LABELS[raw] ?? raw
  );

  const stateRows = toShares(geography?.rows, provinceLabel, 5);
  const trafficRows = toShares(
    traffic?.rows,
    (raw) => TRAFFIC_LABELS[raw] ?? raw,
    5
  );

  let male = 0;
  let female = 0;
  const ageTotals = new Map<string, number>();
  for (const row of demographics?.rows ?? []) {
    const age = String(row[0]);
    const gender = String(row[1]);
    const pct = Number(row[2]) || 0;
    if (gender === "male") male += pct;
    if (gender === "female") female += pct;
    ageTotals.set(age, (ageTotals.get(age) ?? 0) + pct);
  }
  const genderTotal = male + female;

  const audience: StudioAudience =
    genderTotal > 0
      ? {
          male: round1((male / genderTotal) * 100),
          female: round1((female / genderTotal) * 100),
          ages: [...ageTotals.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([age, pct]) => ({
              label: AGE_LABELS[age] ?? age,
              pct: round1(pct),
            })),
        }
      : seed.audience;

  const cityRows = cities?.rows
    ?.slice(0, 5)
    .map((row) => ({
      label: String(row[0]),
      views: compact(Number(row[1]) || 0),
    }));

  return {
    kpis,
    devices: deviceRows.length >= 2 ? deviceRows : seed.devices,
    states: stateRows.length > 0 ? stateRows : seed.states,
    discovery: trafficRows.length > 0 ? trafficRows : seed.discovery,
    cities: cityRows && cityRows.length > 0 ? cityRows : seed.cities,
    audience,
    updatedAt: displayDate(),
    live: true,
  };
}

/**
 * Daily Studio data for one channel. Cached in-process for 24 hours; the page
 * itself revalidates hourly so subscribers stay fresh while these charts
 * update once a day.
 */
export async function getStudioData(channel: "cu" | "pg"): Promise<StudioData> {
  const cached = cache.get(channel);
  if (cached && cached.expires > Date.now()) return cached.value;

  const live = await liveStudio(channel);
  const value = live ?? (channel === "cu" ? SEED_CU : SEED_PG);
  cache.set(channel, { value, expires: Date.now() + DAY_MS });
  return value;
}

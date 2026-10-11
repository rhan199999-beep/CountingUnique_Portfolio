/**
 * Single source of truth for on-site channel numbers.
 * Static Studio values are 28-day snapshots, Mar 31 – Apr 27 2026.
 * Subscriber totals below are seeds — the live scrape in
 * src/lib/youtube.ts refreshes them hourly when reachable.
 */
export const PERIOD_LABEL = "Mar 31 – Apr 27, 2026 · last 28 days";

export const COUNTING_UNIQUE = {
  name: "Counting Unique",
  handle: "@CountingUnique",
  url: "https://www.youtube.com/@CountingUnique",
  searchUrl: "https://www.youtube.com/results?search_query=counting+unique",
  channelId: "UCp57W-eQjbYUPJuTMEfbf1Q",
  fallbackSubs: "4.61M",
  fallbackVideos: "—",
  views28d: "41.1M",
  watchHours28d: "1.91M",
  videoViews28d: "11.4M",
  impressions28d: "175.8M",
  ctr: "4.5%",
  avgViewDuration: "8:07",
  indiaShare: "88.8%",
  maleShare: "68.3%",
  mobileShare: "56.3%",
  tvShare: "33.1%",
} as const;

export const PRANAY_GUPTA = {
  name: "Pranay Gupta",
  handle: "@saypranay",
  url: "https://www.youtube.com/@saypranay",
  searchUrl: "https://www.youtube.com/results?search_query=pranay+gupta",
  channelId: "UCOwoozznw51Qc_fVaLYY9TA",
  fallbackSubs: "8.71M",
  fallbackVideos: "265",
  monthlyAudience: "17.0M",
  subsGained28d: "+85.7k",
  videoViews28d: "2.3M",
  shortsViews28d: "98.4M",
  shortsSubs28d: "+117.9k",
  avgViewDuration: "5:22",
  nonSubShare: "78.5%",
  mobileShare: "81.9%",
} as const;

export const PRANAY_AVATAR =
  "https://yt3.googleusercontent.com/qj-ylQlc1pLnnFXAVZ5qRI2zt4EBlWM6GC3uB9kchNEcICcyfB1PZ0cEwPIyKp46s3ntmpuz=s512-c-k-c0x00ffffff-no-rj";

/** Still of Pranay from the "Left Hand Challenge!" upload on Counting Unique. */
export const PRANAY_ABOUT_PHOTO =
  "https://i.ytimg.com/vi/1Urx4new2J8/hqdefault.jpg";

/** Counting Unique channel profile photo. */
export const CU_AVATAR =
  "https://yt3.googleusercontent.com/eNLPYT75uzPqrA8SsxWP1GpJypZP6y3cfMAcAaef26kv7PPxneNhVU1Q8XNgvwFJM6rFTpQPTw=s512-c-k-c0x00ffffff-no-rj";

export const CU_DEVICES = [
  { label: "Mobile", pct: 56.3 },
  { label: "TV", pct: 33.1 },
  { label: "Computer", pct: 6.9 },
  { label: "Tablet", pct: 3.5 },
] as const;

export const CU_DISCOVERY = [
  { label: "Browse", pct: 46.9 },
  { label: "Suggested", pct: 31.9 },
  { label: "Other features", pct: 9.9 },
  { label: "Channel pages", pct: 4.1 },
  { label: "Search", pct: 4.0 },
] as const;

export const PG_DEVICES = [
  { label: "Mobile", pct: 81.9 },
  { label: "TV", pct: 14.2 },
  { label: "Tablet", pct: 2.0 },
  { label: "Computer", pct: 1.8 },
] as const;

export const TOP_VIDEOS = [
  { title: "I check Reality of Every Disappearing Act", views: "1.8M" },
  { title: "I Stayed in 5 Star Hotel using only …", views: "1.3M" },
  { title: "I travelled in the Longest Running …", views: "1.1M" },
  { title: "I Gave INSANE Tips to Every Worker!", views: "775.7K" },
  { title: "I bought Cheapest Duplicate Produ…", views: "371.4K" },
] as const;

/**
 * Studio dashboard data — 28-day snapshots, Mar 31 – Apr 27 2026,
 * read straight off the YouTube Studio screenshots.
 */
export const CU_KPIS = [
  { value: "41.1M", label: "views in 28 days" },
  { value: "1.91M", label: "watch hours" },
  { value: "3:41", label: "average view duration" },
  { value: "4.5%", label: "impressions click-through" },
] as const;

export const PG_KPIS = [
  { value: "98.4M", label: "Shorts views in 28 days" },
  { value: "17.0M", label: "monthly audience" },
  { value: "+117.9K", label: "new Shorts subscribers" },
  { value: "78.5%", label: "watch time from non-subs" },
] as const;

export const CU_GEO = [
  { label: "India", pct: 88.8 },
  { label: "Pakistan", pct: 6.2 },
  { label: "Bangladesh", pct: 2.2 },
  { label: "Nepal", pct: 1.9 },
] as const;

export const CU_STATES = [
  { label: "Maharashtra", pct: 16.9 },
  { label: "Uttar Pradesh", pct: 14.5 },
  { label: "Gujarat", pct: 7.6 },
  { label: "Bihar", pct: 7.2 },
  { label: "West Bengal", pct: 7.1 },
] as const;

export const PG_STATES = [
  { label: "Uttar Pradesh", pct: 16.9 },
  { label: "Maharashtra", pct: 16.0 },
  { label: "Bihar", pct: 7.6 },
  { label: "Delhi", pct: 7.5 },
  { label: "Gujarat", pct: 7.5 },
] as const;

export const PG_CITIES = [
  { label: "Delhi", views: "6.07M" },
  { label: "Patna", views: "5.29M" },
  { label: "Lucknow", views: "4.58M" },
  { label: "Pune", views: "3.70M" },
  { label: "Mumbai", views: "3.59M" },
] as const;

export const CU_AUDIENCE = {
  male: 68.3,
  female: 31.5,
  ages: [
    { label: "25–34 yrs", pct: 28.6 },
    { label: "35–44 yrs", pct: 27.5 },
    { label: "18–24 yrs", pct: 22.4 },
  ],
} as const;

export const PG_AUDIENCE = {
  male: 56.2,
  female: 43.6,
  ages: [
    { label: "35–44 yrs", pct: 35.1 },
    { label: "25–34 yrs", pct: 33.9 },
    { label: "18–24 yrs", pct: 12.5 },
  ],
} as const;

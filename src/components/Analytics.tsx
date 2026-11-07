"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { StudioData } from "@/lib/studio";

type Slice = { label: string; pct: number };
type BarRow = { label: string; pct: number };

const NEON = ["#6ac6ff", "#ffffff", "#3d93d6", "#a9daff", "#ff5c2b"];

/* Chunky horizontal bars with gradient fills */
function Bars({ rows, unit = "%" }: { rows: readonly BarRow[]; unit?: string }) {
  const reduceMotion = useReducedMotion();
  const max = Math.max(...rows.map((r) => r.pct));
  return (
    <div className="space-y-4">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[15px] font-semibold text-white">{r.label}</span>
            <span className="font-mono text-[14px] font-semibold" style={{ color: NEON[i % NEON.length] }}>
              {r.pct}
              {unit}
            </span>
          </div>
          <div className="mt-1.5 h-3.5 overflow-hidden rounded-full border border-white/20 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(r.pct / max) * 100}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${NEON[i % NEON.length]}, ${NEON[(i + 1) % NEON.length]})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function computeSegments(slices: readonly Slice[], total: number) {
  let acc = 0;
  return slices.map((s, i) => {
    const frac = s.pct / total;
    const offset = acc;
    acc += frac;
    return { s, frac, offset, i };
  });
}

/* Donut chart — pure SVG with gradient fills */
function Donut({ slices, centerNote }: { slices: readonly Slice[]; centerNote: string }) {
  const reduceMotion = useReducedMotion();
  const total = slices.reduce((s, x) => s + x.pct, 0);
  const R = 54;
  const C = 2 * Math.PI * R;
  const segments = computeSegments(slices, total);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
      <motion.svg
        viewBox="0 0 140 140"
        className="h-44 w-44 shrink-0 -rotate-90"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
        role="img"
        aria-label={`Device split, top share ${slices[0].label} ${slices[0].pct}%`}
      >
        <defs>
          {NEON.map((c, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c} stopOpacity="1" />
              <stop offset="100%" stopColor={NEON[(i + 1) % NEON.length]} stopOpacity="0.8" />
            </linearGradient>
          ))}
        </defs>
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" />
        {segments.map(({ s, frac, offset, i }) => (
          <circle
            key={s.label}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={`url(#grad-${i})`}
            strokeWidth="22"
            strokeDasharray={`${frac * C} ${C}`}
            strokeDashoffset={-offset * C}
            strokeLinecap="butt"
          />
        ))}
        <g className="rotate-90" style={{ transformOrigin: "70px 70px" }}>
          <text x="70" y="64" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" fontFamily="inherit">
            {slices[0].pct}%
          </text>
          <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="inherit">
            {centerNote}
          </text>
        </g>
      </motion.svg>
      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5 text-[15px]">
            <span
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 rounded-sm"
              style={{ background: `linear-gradient(135deg, ${NEON[i % NEON.length]}, ${NEON[(i + 1) % NEON.length]})` }}
            />
            <span className="flex-1 text-white/85">{s.label}</span>
            <span className="font-mono text-[14px] font-semibold text-white">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({
  title,
  tag,
  children,
  glow,
}: {
  title: string;
  tag: string;
  children: React.ReactNode;
  glow?: string;
}) {
  return (
    <div
      className="min-w-0 rounded-3xl border-2 border-white/15 bg-white/[0.05] p-6 sm:p-7"
      style={glow ? { boxShadow: `0 0 40px -10px ${glow}` } : undefined}
    >
      <p className="inline-block -rotate-1 rounded-lg border border-white/25 px-2.5 py-0.5 font-mono text-[12px] font-semibold tracking-widest text-sky uppercase">
        {tag}
      </p>
      <h3 className="font-display mt-3 mb-5 text-2xl font-extrabold tracking-tight text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Audience({
  data,
}: {
  data: { male: number; female: number; ages: readonly { label: string; pct: number }[] };
}) {
  const reduceMotion = useReducedMotion();
  const total = data.male + data.female;
  const R = 54;
  const C = 2 * Math.PI * R;
  const maleFrac = data.male / total;
  const femaleFrac = data.female / total;

  return (
    <div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        <motion.svg
          viewBox="0 0 140 140"
          className="h-40 w-40 shrink-0 -rotate-90"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          role="img"
          aria-label={`Gender split, male ${data.male}%, female ${data.female}%`}
        >
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" />
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="#6ac6ff"
            strokeWidth="22"
            strokeDasharray={`${maleFrac * C} ${C}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
          />
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="#ff5c2b"
            strokeWidth="22"
            strokeDasharray={`${femaleFrac * C} ${C}`}
            strokeDashoffset={-maleFrac * C}
            strokeLinecap="butt"
          />
          <g className="rotate-90" style={{ transformOrigin: "70px 70px" }}>
            <text x="70" y="66" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" fontFamily="inherit">
              {data.male}%
            </text>
            <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="inherit">
              male
            </text>
          </g>
        </motion.svg>
        <ul className="w-full min-w-0 flex-1 space-y-2.5">
          <li className="flex items-center gap-2.5 text-[15px]">
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm" style={{ backgroundColor: "#6ac6ff" }} />
            <span className="flex-1 text-white/85">Male</span>
            <span className="font-mono text-[14px] font-semibold text-white">{data.male}%</span>
          </li>
          <li className="flex items-center gap-2.5 text-[15px]">
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm" style={{ backgroundColor: "#ff5c2b" }} />
            <span className="flex-1 text-white/85">Female</span>
            <span className="font-mono text-[14px] font-semibold text-white">{data.female}%</span>
          </li>
        </ul>
      </div>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Age split
        </p>
        <Bars rows={data.ages} />
      </div>
    </div>
  );
}

const KPI_SHADOWS = ["#6ac6ff", "#ffffff", "#6ac6ff", "#ffffff"];

export default function Analytics({ cu, pg }: { cu: StudioData; pg: StudioData }) {
  const [tab, setTab] = useState<"cu" | "pg">("cu");
  const reduceMotion = useReducedMotion();
  const isCu = tab === "cu";
  const data = isCu ? cu : pg;
  const kpis = data.kpis;
  const live = cu.live && pg.live;

  return (
    <section id="numbers" className="dots-bg-light scroll-mt-24 border-b-2 border-ink bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-block -rotate-1 rounded-xl border-2 border-ink bg-sky px-4 py-1.5 font-mono text-[13px] font-bold text-ink shadow-[3px_3px_0_0_#0e69b4]">
              STRAIGHT FROM YOUTUBE STUDIO
            </p>
            <h2 className="font-display mt-5 text-5xl font-extrabold leading-[0.9] tracking-tight sm:text-7xl">
              Studio <span className="text-sky">reports.</span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="block w-fit rounded-full border border-white/20 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-sky">
              {live ? "● Live · refreshed daily" : "Snapshot"} · {cu.updatedAt}
            </span>
          </div>
        </div>
        <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-white/55">
          The last 28 days across both channels, read straight off the Studio
          dashboard. Numbers update automatically when connected to YouTube
          Analytics.
        </p>

        {/* channel tabs */}
        <div role="tablist" aria-label="Channels" className="mt-8 flex flex-wrap gap-3">
          {(
            [
              { id: "cu", label: "Counting Unique", tilt: "-rotate-2", on: "bg-brand text-white shadow-[4px_4px_0_0_#6ac6ff]" },
              { id: "pg", label: "Pranay Gupta", tilt: "rotate-2", on: "bg-sky text-ink shadow-[4px_4px_0_0_#ffffff]" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`font-display inline-flex min-h-[52px] items-center rounded-2xl border-[3px] px-6 text-lg font-extrabold tracking-tight uppercase transition-all hover:-translate-y-0.5 ${t.tilt} ${
                tab === t.id
                  ? `border-ink ${t.on}`
                  : "border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            {/* Headline KPI — the biggest number */}
            <div className="mt-8 rounded-3xl border-2 border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {isCu ? "Total views in 28 days" : "Shorts views in 28 days"}
                  </p>
                  <p className="font-display mt-2 text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
                    {kpis[0].value}
                  </p>
                </div>
                <div className="flex flex-col gap-1 sm:text-right">
                  <p className="font-display text-[15px] font-extrabold text-sky">
                    {kpis[0].label}
                  </p>
                  <p className="font-display text-[12px] font-medium italic leading-snug text-sky/80">
                    {kpis[0].hint}
                  </p>
                </div>
              </div>
            </div>

            {/* KPI strip — remaining 3 metrics */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {kpis.slice(1).map((k, i) => (
                <div
                  key={k.label}
                  className="group rounded-2xl border-2 border-white/15 bg-white/[0.06] p-5 text-white transition-all hover:bg-white/[0.1]"
                >
                  <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {k.value}
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-white/80">{k.label}</p>
                  <p className="mt-1 font-display text-[11px] font-medium italic leading-snug text-sky/60">{k.hint}</p>
                </div>
              ))}
            </div>

            {/* charts row 1 */}
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <Card title="Watch devices" tag={isCu ? "CU · watch time" : "Saypranay · watch time"} glow="#6ac6ff">
                <Donut slices={data.devices} centerNote="on mobile" />
              </Card>
              <Card title="Top states" tag="views share" glow="#a9daff">
                <Bars rows={data.states} />
              </Card>
            </div>

            {/* charts row 2 */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Card title="Who watches" tag="gender + age" glow="#ff5c2b">
                <Audience data={data.audience} />
              </Card>
              {isCu ? (
                <Card title="How they find us" tag="traffic sources" glow="#3d93d6">
                  <Bars rows={data.discovery ?? []} />
                </Card>
              ) : (
                <Card title="Top cities" tag="millions of views" glow="#3d93d6">
                  <div className="space-y-4">
                    {(data.cities ?? []).map((c, i) => (
                      <div key={c.label} className="flex items-baseline gap-3">
                        <span className="font-mono text-[13px] font-bold" style={{ color: NEON[i % NEON.length] }}>
                          0{i + 1}
                        </span>
                        <span className="flex-1 text-[15px] font-semibold text-white">{c.label}</span>
                        <span className="font-display text-xl font-extrabold text-white">{c.views}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

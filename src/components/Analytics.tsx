"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  CU_DEVICES,
  CU_DISCOVERY,
  CU_STATES,
  CU_KPIS,
  CU_AUDIENCE,
  PG_DEVICES,
  PG_STATES,
  PG_CITIES,
  PG_KPIS,
  PG_AUDIENCE,
} from "@/data/channels";

type Slice = { label: string; pct: number };
type BarRow = { label: string; pct: number };

const NEON = ["#FFD23F", "#62c3ff", "#FF6B9D", "#ffffff", "#8affc1"];

/* Chunky horizontal bars, widths relative to the top row */
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
              style={{ backgroundColor: NEON[i % NEON.length] }}
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

/* Donut chart — pure SVG, no chart lib */
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
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="20" />
        {segments.map(({ s, frac, offset, i }) => (
          <circle
            key={s.label}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={NEON[i % NEON.length]}
            strokeWidth="20"
            strokeDasharray={`${frac * C} ${C}`}
            strokeDashoffset={-offset * C}
            strokeLinecap="butt"
          />
        ))}
        <g className="rotate-90" style={{ transformOrigin: "70px 70px" }}>
          <text x="70" y="66" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="inherit">
            {slices[0].pct}%
          </text>
          <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="inherit">
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
              style={{ backgroundColor: NEON[i % NEON.length] }}
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
}: {
  title: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-3xl border-2 border-white/15 bg-white/[0.05] p-6 sm:p-7">
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
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Male", pct: data.male, color: "#62c3ff" },
          { label: "Female", pct: data.female, color: "#FF6B9D" },
        ].map((g) => (
          <div key={g.label} className="rounded-2xl border border-white/15 bg-ink p-4">
            <p className="font-display text-4xl font-extrabold sm:text-5xl" style={{ color: g.color }}>
              {g.pct}%
            </p>
            <p className="mt-1 text-[14px] font-semibold text-white/70">{g.label}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${g.pct}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: g.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Bars rows={data.ages} />
      </div>
    </div>
  );
}

const KPI_SHADOWS = ["#62c3ff", "#FFD23F", "#FF6B9D", "#ffffff"];

export default function Analytics() {
  const [tab, setTab] = useState<"cu" | "pg">("cu");
  const reduceMotion = useReducedMotion();
  const isCu = tab === "cu";
  const kpis = isCu ? CU_KPIS : PG_KPIS;

  return (
    <section id="numbers" className="dots-bg-light scroll-mt-20 border-t-2 border-ink bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
        <p className="inline-block -rotate-1 rounded-xl border-2 border-ink bg-[#FFD23F] px-4 py-1.5 font-mono text-[13px] font-bold text-ink shadow-[3px_3px_0_0_#62c3ff]">
          ★ STRAIGHT FROM YOUTUBE STUDIO
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-tight sm:text-7xl">
            Studio <span className="text-sky">reports.</span>
          </h2>
        </div>

        {/* channel tabs */}
        <div role="tablist" aria-label="Channels" className="mt-8 flex flex-wrap gap-3">
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
              className={`font-display inline-flex min-h-[52px] items-center rounded-2xl border-2 px-6 text-lg font-extrabold tracking-tight transition-all ${
                tab === t.id
                  ? "-rotate-1 border-ink bg-[#FFD23F] text-ink shadow-[4px_4px_0_0_#62c3ff]"
                  : "border-white/25 text-white hover:border-white/60 hover:bg-white/10"
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
            {/* KPI strip */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {kpis.map((k, i) => (
                <div
                  key={k.label}
                  className={`rounded-2xl border-2 border-ink bg-white p-5 text-ink ${
                    i % 2 === 0 ? "rotate-1" : "-rotate-1"
                  }`}
                  style={{ boxShadow: `5px 5px 0 0 ${KPI_SHADOWS[i % KPI_SHADOWS.length]}` }}
                >
                  <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {k.value}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-snug font-medium text-ink/60">{k.label}</p>
                </div>
              ))}
            </div>

            {/* charts row 1 */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Card title="Watch devices" tag={isCu ? "CU · watch time" : "Saypranay · watch time"}>
                <Donut slices={isCu ? CU_DEVICES : PG_DEVICES} centerNote="on mobile" />
              </Card>
              <Card title={isCu ? "Top states" : "Top states"} tag="views share">
                <Bars rows={isCu ? CU_STATES : PG_STATES} />
              </Card>
            </div>

            {/* charts row 2 */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Card title="Who watches" tag="gender + age">
                <Audience data={isCu ? CU_AUDIENCE : PG_AUDIENCE} />
              </Card>
              {isCu ? (
                <Card title="How they find us" tag="traffic sources">
                  <Bars rows={CU_DISCOVERY} />
                </Card>
              ) : (
                <Card title="Top cities" tag="millions of views">
                  <div className="space-y-4">
                    {PG_CITIES.map((c, i) => (
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

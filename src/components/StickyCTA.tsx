"use client";

import { useEffect, useState } from "react";
import { COUNTING_UNIQUE } from "@/data/channels";
import { watchUrl } from "@/lib/youtube";

/**
 * Mobile-first persistent YouTube action bar. Appears after the hero so
 * the first screen stays clean, and stays out of the way on desktop where
 * the nav already carries the buttons.
 */
export default function StickyCTA({ latestId }: { latestId?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-paper/95 px-3 pt-2.5 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <a
          href={latestId ? watchUrl(latestId) : "#latest"}
          {...(latestId
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-extrabold text-white shadow-[3px_3px_0_0_#6ac6ff]"
        >
          <span aria-hidden className="text-[10px]">
            ▶
          </span>
          Watch latest
        </a>
        <a
          href={COUNTING_UNIQUE.url}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-action text-[14px] font-extrabold text-ink shadow-[3px_3px_0_0_#08243f]"
        >
          Subscribe
        </a>
      </div>
    </div>
  );
}

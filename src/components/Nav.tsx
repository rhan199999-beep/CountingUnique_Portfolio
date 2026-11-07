"use client";

import { useState } from "react";
import Image from "next/image";

const links = [
  { href: "#latest", label: "Videos" },
  { href: "#channels", label: "Channels" },
  { href: "#about", label: "About" },
  { href: "#partners", label: "Brands" },
  { href: "#numbers", label: "Stats" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
      >
        <a
          href="#top"
          aria-label="Counting Unique™ — home"
          className="shrink-0 transition-transform hover:-rotate-2 hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Counting Unique"
            width={1646}
            height={804}
            priority
            style={{ height: 52, width: "auto" }}
          />
        </a>

        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-0.5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-display relative inline-flex min-h-[44px] items-center rounded-full px-3 text-[13px] font-extrabold tracking-wide text-ink/65 uppercase transition-all hover:-translate-y-0.5 hover:text-ink after:absolute after:inset-x-3 after:-bottom-2 after:h-0.5 after:origin-bottom after:bg-action after:content-[''] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#work"
            className="font-display ml-1 inline-flex min-h-[44px] items-center rounded-full border-2 border-ink bg-action px-5 text-[12px] font-extrabold tracking-wide text-ink uppercase shadow-[3px_3px_0_0_#08243f] transition-transform hover:-translate-y-0.5"
          >
            Work with me
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#work"
            className="font-display inline-flex min-h-[44px] items-center rounded-full border-2 border-ink bg-action px-4 text-[11px] font-extrabold tracking-wide text-ink uppercase shadow-[2px_2px_0_0_#08243f]"
          >
            Work with me
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="font-display inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-ink bg-sky px-4 text-[13px] font-extrabold tracking-wide text-ink uppercase shadow-[2px_2px_0_0_#08243f]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t-2 border-ink px-5 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display flex min-h-[48px] items-center rounded-xl border-2 border-transparent px-3 text-[16px] font-extrabold tracking-wide text-ink uppercase hover:border-ink hover:bg-sky"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}

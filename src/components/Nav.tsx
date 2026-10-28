"use client";

import { useState } from "react";
import Image from "next/image";

const links = [
  { href: "#about", label: "About" },
  { href: "#channels", label: "Channels" },
  { href: "#latest", label: "Latest" },
  { href: "#numbers", label: "Stats" },
  { href: "#partners", label: "Partners" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex min-h-[96px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
      >
        <a href="#top" aria-label="Counting Unique™ — home" className="shrink-0 transition-transform hover:-rotate-2 hover:scale-105">
          <Image
            src="/logo.png"
            alt="Counting Unique"
            width={1646}
            height={804}
            priority
            style={{ height: 72, width: "auto" }}
          />
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-display inline-flex min-h-[44px] items-center rounded-full border-2 border-transparent px-4 text-[16px] font-extrabold tracking-wide text-ink uppercase transition-all hover:-rotate-2 hover:border-ink hover:bg-[#FFD23F] hover:shadow-[3px_3px_0_0_#0f0f0f] focus-visible:outline-2"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="font-display inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-ink bg-[#FFD23F] px-5 text-[15px] font-extrabold tracking-wide text-ink uppercase shadow-[3px_3px_0_0_#0f0f0f] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t-2 border-ink px-5 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display flex min-h-[48px] items-center rounded-xl border-2 border-transparent px-3 text-[17px] font-extrabold tracking-wide text-ink uppercase hover:border-ink hover:bg-[#FFD23F]"
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

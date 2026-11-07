"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Video thumbnail that quietly swaps to a muted YouTube preview after a
 * short desktop hover. The iframe is only mounted while hovering, is
 * pointer-events-none so the wrapping link stays clickable, and never
 * loads on touch devices. Everything fails back to the poster frame.
 */
export default function VideoPreview({
  id,
  title,
  src,
  sizes,
  priority,
  className = "",
}: {
  id: string;
  title: string;
  src: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const start = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clear();
    timer.current = setTimeout(() => setPlaying(true), 420);
  };

  const stop = () => {
    clear();
    setPlaying(false);
  };

  return (
    <span
      className={`absolute inset-0 block overflow-hidden bg-ink ${className}`}
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      {failed ? (
        <span className="flex h-full w-full items-center justify-center bg-ink text-xs font-semibold text-white/45">
          Preview unavailable
        </span>
      ) : (
        <Image
          src={src}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          draggable={false}
        />
      )}

      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${id}&rel=0`}
          title={`${title} — muted preview`}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ) : null}
    </span>
  );
}

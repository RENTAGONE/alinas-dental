"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Art } from "@/lib/data";

const GLYPH: Record<Art, ReactNode> = {
  tooth: <path d="M32 8c-4 0-7 2.5-12 2.5C13 10.5 9 15 10 23c.8 6 4 10 5 18 .8 6 1.6 15 5.4 15 3.2 0 4-8 5.6-12 1.2-3 2.6-3.5 6-3.5s4.8.5 6 3.5c1.6 4 2.4 12 5.6 12 3.8 0 4.6-9 5.4-15 1-8 4.2-12 5-18 1-8-3-12.5-10-12.5C39 10.5 36 8 32 8z" />,
  smile: <><path d="M6 24c8 24 44 24 52 0" /><path d="M12 28c8 14 32 14 40 0" /><path d="M22 36v8M32 38v9M42 36v8" /></>,
  scan: <><circle cx="32" cy="32" r="22" /><circle cx="32" cy="32" r="12" /><path d="M32 4v12M32 48v12M4 32h12M48 32h12" /></>,
  skin: <path d="M32 6c2 14 8 20 22 26-14 6-20 12-22 26-2-14-8-20-22-26 14-6 20-12 22-26z" />,
  team: <><circle cx="32" cy="22" r="10" /><path d="M10 58c2-14 12-20 22-20s20 6 22 20" /></>,
  clinic: <path d="M26 8h12v18h18v12H38v18H26V38H8V26h18z" />,
};

function ArtFallback({ kind, dim }: { kind: Art; dim?: boolean }) {
  return (
    <div className={cn("absolute inset-0", dim && "brightness-75 saturate-0")} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgb(var(--ink-700))_0%,rgb(var(--ink-900))_55%,rgb(var(--ink-950))_100%)]" />
      <div className="absolute -right-1/4 top-1/4 h-2/3 w-2/3 rounded-full bg-lagoon-400/25 blur-3xl" />
      <div className="absolute -left-1/4 bottom-0 h-1/2 w-1/2 rounded-full bg-brass-400/20 blur-3xl" />
      <svg
        viewBox="0 0 64 64" fill="none" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
        className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 stroke-brass-300/80 drop-shadow-[0_0_18px_rgb(var(--lagoon-400)/0.5)]"
      >
        {GLYPH[kind]}
      </svg>
    </div>
  );
}

/** Shows /public photo if it exists, otherwise a designed art fallback. Drop real photos in later: zero code changes. */
export function Photo({ src, alt, art = "clinic", dim, className, priority }: { src: string; alt: string; art?: Art; dim?: boolean; className?: string; priority?: boolean }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);
  return (
    <div className={cn("relative isolate overflow-hidden bg-ink-800", className)}>
      <ArtFallback kind={art} dim={dim} />
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={src} alt={alt} loading={priority ? "eager" : "lazy"} onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}

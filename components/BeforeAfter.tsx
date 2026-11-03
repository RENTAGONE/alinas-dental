"use client";

import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { bi, type Bi } from "@/lib/i18n";
import { useLang } from "./Providers";

/** True only when both images load. Missing case photos never show a placeholder or a made-up result. */
function useBothLoaded(a: string, b: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    let loaded = 0;
    const done = () => { loaded += 1; if (loaded === 2 && alive) setOk(true); };
    const i1 = new Image();
    const i2 = new Image();
    i1.onload = done;
    i2.onload = done;
    i1.src = a;
    i2.src = b;
    return () => { alive = false; };
  }, [a, b]);
  return ok;
}

/**
 * Drag-to-compare case photos for one treatment. Files: /public/images/results/<slug>-before.jpg and <slug>-after.jpg.
 * Renders nothing until both exist.
 */
export function CasePhotos({ slug, name }: { slug: string; name: Bi }) {
  const { tr } = useLang();
  const before = `/images/results/${slug}-before.jpg`;
  const after = `/images/results/${slug}-after.jpg`;
  const ok = useBothLoaded(before, after);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const [pos, setPos] = useState(50);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  if (!ok) return null;
  const label = "absolute top-3 rounded-full bg-ink-950/75 px-3 py-1 text-xs font-medium text-white";
  return (
    <div className="mt-16">
      <h3 className="text-2xl text-ink-950 sm:text-3xl">{tr(bi("কেসের ছবি", "Case photos"))}</h3>
      <div
        ref={box}
        className="relative mt-6 aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-xl ring-1 ring-ink-950/10"
        onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => { if (drag.current) move(e.clientX); }}
        onPointerUp={() => { drag.current = false; }}
        onPointerCancel={() => { drag.current = false; }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt={`${tr(name)}: ${tr(bi("পরে", "after"))}`} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={`${tr(name)}: ${tr(bi("আগে", "before"))}`} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className={`${label} left-3`}>{tr(bi("আগে", "Before"))}</span>
        <span className={`${label} right-3`}>{tr(bi("পরে", "After"))}</span>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }} />
        <button
          type="button" role="slider" aria-label={tr(bi("আগে ও পরের তুলনা", "Before and after comparison"))} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); setPos((p) => Math.max(0, p - 5)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + 5)); }
          }}
          className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-ink-950/80 text-white"
          style={{ left: `${pos}%` }}
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-sm text-ink-950/60">{tr(bi("ক্লিনিকের কেসের ছবি। ফলাফল রোগীভেদে আলাদা হয়।", "Case photos from the clinic. Results differ from patient to patient."))}</p>
    </div>
  );
}

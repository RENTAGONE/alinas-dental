"use client";

import { useEffect, useState } from "react";
import { bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { DAY_SHORT, chamberStatus, type ChamberStatus } from "@/lib/dhaka";
import { SITE } from "@/lib/site";
import { useLang } from "./Providers";
import { Mono } from "./ui";

/**
 * Live Dhaka chamber telemetry. With hours configured it reads open/closed on the Asia/Dhaka clock (UTC+6);
 * with no hours it shows the live zone badge instead. One animate-ping dot, emerald when open.
 */
export function LiveStatus({ className, tone = "dark", bare = false }: { className?: string; tone?: "dark" | "light"; bare?: boolean }) {
  const { tr, lang } = useLang();
  const [st, setSt] = useState<ChamberStatus | null>(null);
  const sch = SITE.schedule;
  const live = SITE.hours.length > 0 && sch !== null;

  useEffect(() => {
    if (!live || !sch) return;
    const tick = () => setSt(chamberStatus(sch));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [live, sch]);

  const shell = cn(
    "inline-flex min-h-7 items-center gap-2 text-xs font-medium",
    !bare && "rounded-full border px-3 py-1",
    !bare && (tone === "dark" ? "border-white/20 bg-white/[0.06] text-white" : "border-ink-950/15 bg-ink-950/[0.04] text-ink-950"),
    bare && (tone === "dark" ? "text-white" : "text-ink-950"),
    lang === "en" && "uppercase tracking-wide",
    className,
  );
  const open = st?.open === true;
  const dot = (
    <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
      {(open || !live) && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", open || !st ? "bg-emerald-500" : "bg-brass-400")} />
    </span>
  );

  if (!st) {
    return (
      <span role="status" className={shell}>
        {dot}
        <span>{tr(bi("লাইভ চেম্বার: ", "Live chamber: "))}{tr(SITE.zone)}</span>
      </span>
    );
  }
  return (
    <span role="status" className={shell}>
      {dot}
      {open ? (
        <span>{tr(bi("এখন খোলা", "Open now"))} • {tr(bi("বন্ধ হবে ", "Closes "))}<Mono>{st.time}</Mono></span>
      ) : (
        <span>{tr(bi("বন্ধ", "Closed"))} • {tr(bi("খুলবে ", "Opens "))}{st.dayIdx !== null && <>{tr(DAY_SHORT[st.dayIdx])} </>}<Mono>{st.time}</Mono></span>
      )}
    </span>
  );
}

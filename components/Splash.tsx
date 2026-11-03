"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { GraceLotus } from "./GraceLotus";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * S02: Split Vault Doors. Two ink doors close on a central Grace Crest and bilingual title,
 * hold, then part left and right (ease 0.76, 0, 0.24, 1). Plays on every load: nothing is stored.
 */
export function Splash({ show, onSkip }: { show: boolean; onSkip: () => void }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (show) return;
    const id = window.setTimeout(() => setGone(true), 1600);
    return () => window.clearTimeout(id);
  }, [show]);

  if (gone) return null;

  const door = "absolute inset-y-0 w-1/2 bg-ink-950";
  const panel = "pointer-events-none absolute inset-5 border border-white/[0.07] sm:inset-8";
  return (
    <div role="dialog" aria-label="Opening" aria-hidden={!show} className="splash-failsafe fixed inset-0 z-[60] overflow-hidden" style={{ pointerEvents: show ? "auto" : "none" }}>
      <motion.div initial={false} animate={{ x: show ? "0%" : "-100%" }} transition={{ duration: 0.95, ease: EASE }} className={cn(door, "left-0 border-r border-brass-400/50")}>
        <div className={panel} />
      </motion.div>
      <motion.div initial={false} animate={{ x: show ? "0%" : "100%" }} transition={{ duration: 0.95, ease: EASE }} className={cn(door, "right-0 border-l border-brass-400/50")}>
        <div className={panel} />
      </motion.div>

      <motion.div
        initial={false}
        animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <GraceLotus className="h-40 w-40 sm:h-52 sm:w-52" delay={0.1} />
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}>
          <p className="font-display text-3xl text-white sm:text-4xl">{SITE.name}</p>
          <p className="mt-2 font-display text-lg text-brass-300">{SITE.nameBn}</p>
          <p className="mt-4 font-mono text-xs text-white/55">{SITE.zone.en}</p>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={onSkip}
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-8 left-1/2 z-20 min-h-12 -translate-x-1/2 rounded-full border border-white/25 px-7 text-sm text-white/80 hover:bg-white/10"
      >
        Skip
      </motion.button>
    </div>
  );
}

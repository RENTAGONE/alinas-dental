"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock } from "lucide-react";
import { bi, taka } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { TREATMENTS } from "@/lib/data";
import { useLang } from "./Providers";
import { Photo } from "./Photo";
import { SOFT } from "./Reveal";
import { TierEstimator, type TierId } from "./TierEstimator";
import { Mono, Section, SectionHead, Tx } from "./ui";

/** Tabbed explorer (never a pinned horizontal gallery). Pick a treatment, then a tier band, and the listed range updates live. */
export function TreatmentExplorer() {
  const { tr } = useLang();
  const [i, setI] = useState(0);
  const [tierId, setTierId] = useState<TierId>("standard");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const n = TREATMENTS.length;
  const t = TREATMENTS[i];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (next === null) return;
    e.preventDefault();
    setI(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section tone="light" id="treatments">
      <SectionHead
        title={bi("ট্রিটমেন্ট ও তালিকাভুক্ত খরচ", "Treatments and listed costs")}
        sub={bi("একটি ট্রিটমেন্ট ও একটি স্তর বেছে নিন; ক্লিনিকের তালিকাভুক্ত পরিসর সঙ্গে সঙ্গে দেখুন।", "Pick a treatment and a tier to see the clinic’s listed range straight away.")}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
        <div role="tablist" aria-label={tr(bi("ট্রিটমেন্ট", "Treatments"))} onKeyDown={onKey} className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1">
          {TREATMENTS.map((x, idx) => {
            const active = idx === i;
            return (
              <button
                key={x.slug} ref={(el) => { tabs.current[idx] = el; }} role="tab" id={`tab-${x.slug}`} aria-selected={active} aria-controls="treatment-panel" tabIndex={active ? 0 : -1}
                onClick={() => setI(idx)}
                className={cn("relative flex min-h-14 items-center justify-between gap-3 rounded-lg border px-4 py-2 text-left transition-colors lg:min-h-16", active ? "border-transparent text-white" : "border-ink-950/15 text-ink-950/75 hover:border-ink-950/40 hover:text-ink-950")}
              >
                {active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-ink-950" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className="relative font-display text-base font-semibold lg:text-xl">{tr(x.tab)}</span>
                <Mono className={cn("relative hidden text-xs lg:block", active ? "text-brass-300" : "text-ink-950/55")}>{taka(x.from)}+</Mono>
              </button>
            );
          })}
        </div>

        <div id="treatment-panel" role="tabpanel" aria-labelledby={`tab-${t.slug}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={t.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: SOFT }} className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
              <Photo src={t.image} alt={tr(t.name)} art={t.art} className="aspect-[4/5] w-full rounded-xl ring-1 ring-ink-950/10 md:aspect-[3/4]" />
              <div>
                <h3 className="text-2xl text-ink-950 sm:text-3xl">{tr(t.name)}</h3>
                <p className="mt-3 text-ink-950/75"><Tx b={t.short} /></p>
                <p className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full border border-ink-950/15 px-3 text-sm text-ink-950/75"><Clock className="h-4 w-4 text-lagoon-600" /><Tx b={t.duration} /></p>
                <ul className="mt-5 space-y-2.5">
                  {t.benefits.map((b) => (
                    <li key={b.en} className="flex gap-3 text-ink-950/85"><Check className="mt-1.5 h-4 w-4 shrink-0 text-lagoon-600" /><span><Tx b={b} /></span></li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <TierEstimator t={t} tierId={tierId} onChange={setTierId} />
            <Link href={`/treatments/${t.slug}`} className="btn-line mt-4">{tr(bi("বিস্তারিত দেখুন", "See details"))}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

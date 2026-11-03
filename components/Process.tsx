"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { PROCESS } from "@/lib/data";
import { useLang } from "./Providers";
import { Reveal } from "./Reveal";
import { Mono, Section, SectionHead, Tx, type Tone } from "./ui";

/** Treatment process: four steps from first message to follow-up. The rule line grows as you scroll. */
export function Process({ tone = "light" }: { tone?: Tone }) {
  const { tr } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const grow = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dark = tone !== "light";
  return (
    <Section tone={tone}>
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <SectionHead dark={dark} title={bi("চিকিৎসা প্রক্রিয়া", "Treatment process")} sub={bi("প্রথম বার্তা থেকে ফলো-আপ পর্যন্ত চারটি ধাপ।", "Four steps, from the first message to follow-up.")} />
        </div>
        <ol ref={ref} className="relative space-y-12 pl-16">
          <div className={cn("absolute bottom-2 left-[1.45rem] top-2 w-px", dark ? "bg-white/15" : "bg-ink-950/15")} />
          <motion.div style={{ scaleY: grow }} className="absolute bottom-2 left-[1.45rem] top-2 w-px origin-top bg-gradient-to-b from-lagoon-400 to-brass-400" />
          {PROCESS.map((s, i) => (
            <li key={s.t.en} className="relative">
              <Reveal>
                <span className={cn("absolute -left-16 top-0 flex h-12 w-12 items-center justify-center rounded-full border text-lg", dark ? "border-white/20 bg-ink-900 text-brass-300" : "border-ink-950/15 bg-white text-ink-950")}><Mono>{i + 1}</Mono></span>
                <h3 className="text-2xl sm:text-3xl">{tr(s.t)}</h3>
                <p className={cn("mt-3 max-w-xl text-lg", dark ? "text-white/70" : "text-ink-950/70")}><Tx b={s.d} /></p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

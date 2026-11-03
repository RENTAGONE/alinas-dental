"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE: [number, number, number, number] = [0.5, 0, 0.2, 1];

interface Stroke { d: string; w?: number; o?: number }

/** M06: Aesthetic Grace Lotus & Precision Crown line-art. Lotus petals, a crown rising above them, and a precision dial. */
const LOTUS: Stroke[] = [
  { d: "M120 206C72 202 36 170 28 122C62 130 98 154 120 206Z" },
  { d: "M120 206C168 202 204 170 212 122C178 130 142 154 120 206Z" },
  { d: "M120 206C86 194 62 160 62 112C88 124 110 154 120 206Z" },
  { d: "M120 206C154 194 178 160 178 112C152 124 130 154 120 206Z" },
  { d: "M120 206C100 172 96 132 120 100C144 132 140 172 120 206Z" },
];
const CROWN: Stroke[] = [
  { d: "M91 46C91 35 99 29 107 31C113 33 116 37 120 37C124 37 127 33 133 31C141 29 149 35 149 46C149 60 143 68 141 80C140 88 137 93 133 93C129 93 128 85 125 79C123 75 117 75 115 79C112 85 111 93 107 93C103 93 100 88 99 80C97 68 91 60 91 46Z", w: 1.8 },
  { d: "M104 46C108 52 132 52 136 46", o: 0.55 },
  { d: "M120 100V94", o: 0.6 },
];
const PRECISION: Stroke[] = [
  { d: "M120 10v10M230 120h-10M120 230v-10M10 120h10", o: 0.6 },
  { d: "M44 208H196", o: 0.5 },
];

const TONE = { brass: "stroke-brass-400", ink: "stroke-brass-600", lagoon: "stroke-lagoon-400" } as const;

interface Props {
  className?: string;
  delay?: number;
  /** Draw when scrolled into view instead of on mount. */
  inView?: boolean;
  /** No animation (logo marks). */
  still?: boolean;
  /** Lotus and crown only, without the dial. */
  mark?: boolean;
  tone?: keyof typeof TONE;
}

export function GraceLotus({ className, delay = 0, inView = false, still = false, mark = false, tone = "brass" }: Props) {
  const strokes: Stroke[] = [...LOTUS, ...CROWN, ...(mark ? [] : PRECISION)];
  const ring = !mark;
  return (
    <svg viewBox="0 0 240 240" className={cn("fill-none", TONE[tone], className)} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ring && (still
        ? <circle cx="120" cy="120" r="110" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="0.5 5" />
        : <motion.circle cx="120" cy="120" r="110" strokeWidth="1.2" strokeDasharray="0.5 5" initial={{ opacity: 0 }} {...(inView ? { whileInView: { opacity: 0.35 }, viewport: { once: true, margin: "-60px" } } : { animate: { opacity: 0.35 } })} transition={{ delay: delay + 0.6, duration: 1.2 }} />)}
      {strokes.map((s, i) => {
        const w = s.w ?? 1.4;
        const o = s.o ?? 1;
        if (still) return <path key={s.d} d={s.d} strokeWidth={w} strokeOpacity={o} />;
        const run = inView
          ? { whileInView: { pathLength: 1, opacity: o }, viewport: { once: true, margin: "-60px" } }
          : { animate: { pathLength: 1, opacity: o } };
        return <motion.path key={s.d} d={s.d} strokeWidth={w} initial={{ pathLength: 0, opacity: 0 }} {...run} transition={{ delay: delay + i * 0.11, duration: 1.1, ease: EASE }} />;
      })}
    </svg>
  );
}

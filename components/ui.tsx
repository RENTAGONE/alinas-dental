"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fmt, takaRange, taka, type Bi } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { useLang } from "./Providers";
import { GraceLotus } from "./GraceLotus";
import { Reveal } from "./Reveal";

/** Every figure (৳, ratings, counts, phone numbers, durations) renders through this. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono tabular-nums", className)}>{children}</span>;
}

/** Renders a string where {{...}} segments are set in monospace. */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith("{{") ? <Mono key={i} className={className}>{p.slice(2, -2)}</Mono> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

/** Translates a Bi string for the current language, with {{mono}} support. */
export function Tx({ b, className }: { b: Bi; className?: string }) {
  const { tr } = useLang();
  return <Rich text={tr(b)} className={className} />;
}

export function Taka({ n, className }: { n: number; className?: string }) {
  return <Mono className={className}>{taka(n)}</Mono>;
}
export function TakaRange({ from, to, className }: { from: number; to: number; className?: string }) {
  return <Mono className={className}>{takaRange(from, to)}</Mono>;
}
export const Num = ({ n, className }: { n: number; className?: string }) => <Mono className={className}>{fmt(n)}</Mono>;

export function SectionHead({ title, sub, dark = false, className }: { title: Bi; sub?: Bi; dark?: boolean; className?: string }) {
  const { tr } = useLang();
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <h2 className={cn("text-[clamp(1.9rem,4vw,3.2rem)]", dark ? "text-white" : "text-ink-950")}>{tr(title)}</h2>
      <span className="mt-5 block h-px w-16 bg-brass-400" aria-hidden />
      {sub && <p className={cn("mt-5 text-lg", dark ? "text-white/70" : "text-ink-950/70")}><Rich text={tr(sub)} /></p>}
    </Reveal>
  );
}

export type Tone = "dark" | "mid" | "light";

export function Section({ children, tone = "dark", className, id }: { children: ReactNode; tone?: Tone; className?: string; id?: string }) {
  const bg = tone === "dark" ? "bg-ink-950 text-white" : tone === "mid" ? "bg-ink-900 text-white" : "bg-porcelain text-ink-950";
  return (
    <section id={id} className={cn("relative overflow-x-clip py-20 sm:py-28", bg, className)}>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function PageHero({ title, sub, crumb }: { title: Bi; sub: Bi; crumb: Bi }) {
  const { tr } = useLang();
  return (
    <section className="grain relative overflow-x-clip bg-ink-950 pb-16 pt-36 text-white sm:pb-24 sm:pt-44">
      <GraceLotus tone="brass" delay={0.3} className="pointer-events-none absolute -right-16 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 opacity-30 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="text-sm text-brass-300"><Link href="/" className="inline-flex min-h-12 items-center hover:underline">{SITE.name}</Link> / {tr(crumb)}</p></Reveal>
        <Reveal delay={0.08}><h1 className="max-w-3xl text-[clamp(2.2rem,5.4vw,4.4rem)] text-white">{tr(title)}</h1></Reveal>
        <Reveal delay={0.16}><p className="mt-6 max-w-2xl text-lg text-white/75"><Rich text={tr(sub)} /></p></Reveal>
      </div>
    </section>
  );
}

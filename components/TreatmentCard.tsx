"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Treatment } from "@/lib/data";
import { useLang } from "./Providers";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { TakaRange, Tx } from "./ui";

export function TreatmentCard({ t, delay = 0 }: { t: Treatment; delay?: number }) {
  const { tr } = useLang();
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/treatments/${t.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-950/10 bg-white transition-colors hover:border-ink-950/40">
        <Photo src={t.image} alt={tr(t.name)} art={t.art} className="aspect-[4/3] w-full" />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl text-ink-950 sm:text-2xl">{tr(t.name)}</h3>
          <p className="mt-2 flex-1 text-ink-950/70"><Tx b={t.short} /></p>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-ink-950/10 pt-4">
            <div>
              <p className="text-lg font-semibold text-ink-950"><TakaRange from={t.from} to={t.to} /></p>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-ink-950/60">{tr(t.unit)} <Clock className="h-3.5 w-3.5" /><Tx b={t.duration} /></p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-950 text-white transition-colors group-hover:bg-brass-400 group-hover:text-ink-950"><ArrowUpRight className="h-5 w-5" /></span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

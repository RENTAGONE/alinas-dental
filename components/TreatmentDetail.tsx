"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, MessageCircle } from "lucide-react";
import { bi } from "@/lib/i18n";
import { TREATMENTS, type Treatment } from "@/lib/data";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { CasePhotos } from "./BeforeAfter";
import { CTABand } from "./CTABand";
import { FAQ } from "./FAQ";
import { Photo } from "./Photo";
import { Process } from "./Process";
import { Reveal } from "./Reveal";
import { TierEstimator, type TierId } from "./TierEstimator";
import { TreatmentCard } from "./TreatmentCard";
import { Section, SectionHead, TakaRange, Tx } from "./ui";

export function TreatmentDetail({ t }: { t: Treatment }) {
  const { tr } = useLang();
  const [tierId, setTierId] = useState<TierId>("standard");
  const others = TREATMENTS.filter((x) => x.slug !== t.slug).slice(0, 3);

  return (
    <>
      <section className="grain relative overflow-x-clip bg-ink-950 pb-16 pt-36 text-white sm:pb-24 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_20%,rgb(var(--ink-700)/0.55),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal><p className="text-sm text-brass-300"><Link href="/treatments" className="inline-flex min-h-12 items-center hover:underline">{tr(bi("ট্রিটমেন্ট", "Treatments"))}</Link> / {tr(t.tab)}</p></Reveal>
            <Reveal delay={0.08}><h1 className="text-[clamp(2rem,4.6vw,3.8rem)] text-white">{tr(t.name)}</h1></Reveal>
            <Reveal delay={0.16}><p className="mt-5 max-w-xl text-lg text-white/75"><Tx b={t.short} /></p></Reveal>
            <Reveal delay={0.24} className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-sm"><Clock className="h-4 w-4 text-brass-400" /><Tx b={t.duration} /></span>
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-sm"><TakaRange from={t.from} to={t.to} className="text-brass-300" /> {tr(t.unit)}</span>
            </Reveal>
            <Reveal delay={0.32} className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#book" className="btn-brass">{tr(bi("চেম্বার স্লট দেখুন", "Check chamber slot"))}<ArrowRight className="h-4 w-4" /></Link>
              <a href={wa(`Assalamu Alaikum, I have a question about ${t.name.en} at ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative">
            <span className="absolute -bottom-3 -right-3 h-full w-full rounded-xl border border-brass-400/50" aria-hidden />
            <Photo src={t.image} alt={tr(t.name)} art={t.art} priority className="relative aspect-[4/5] w-full rounded-xl" />
          </Reveal>
        </div>
      </section>

      <Section tone="light">
        <SectionHead title={bi("এই ট্রিটমেন্টে কী আছে", "What this treatment covers")} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.benefits.map((b, i) => (
            <Reveal key={b.en} delay={i * 0.08} className="h-full">
              <div className="flex h-full gap-4 rounded-xl border border-ink-950/10 bg-white p-6">
                <Check className="mt-1 h-5 w-5 shrink-0 text-lagoon-600" /><p className="text-lg text-ink-950/85"><Tx b={b} /></p>
              </div>
            </Reveal>
          ))}
        </div>
        <CasePhotos slug={t.slug} name={t.name} />
      </Section>

      <Section tone="dark">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead dark title={bi("তালিকাভুক্ত খরচ, স্তর অনুযায়ী", "Listed cost, by tier")} sub={bi("স্তর বদলালে পরিসর সঙ্গে সঙ্গে বদলায়।", "The range changes as you change the tier.")} />
          <Reveal><TierEstimator t={t} tierId={tierId} onChange={setTierId} tone="dark" /></Reveal>
        </div>
      </Section>

      <Section tone="light">
        <SectionHead title={bi("অন্যান্য ট্রিটমেন্ট", "Other treatments")} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {others.map((o, i) => <TreatmentCard key={o.slug} t={o} delay={i * 0.08} />)}
        </div>
      </Section>

      <Process tone="dark" />
      <FAQ tone="light" />
      <CTABand />
    </>
  );
}

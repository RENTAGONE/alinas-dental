"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bi, fmt } from "@/lib/i18n";
import { REVIEWS, TREATMENTS } from "@/lib/data";
import { MAPS_LINK, SITE } from "@/lib/site";
import { useLang } from "./Providers";
import { Reveal } from "./Reveal";
import { Mono, Section, SectionHead, Tx, type Tone } from "./ui";

/**
 * Google rating plus the review themes the client confirmed. Themes are labelled as paraphrases, never shown as verbatim quotes.
 * REVIEWS empty: only the rating block shows.
 */
export function Reviews({ tone = "light" }: { tone?: Tone }) {
  const { tr } = useLang();
  const hasThemes = REVIEWS.some((r) => r.kind === "theme");
  return (
    <Section tone={tone}>
      <SectionHead title={bi("Google রিভিউ", "Google reviews")} sub={bi("রোগীদের দেওয়া রেটিং এবং রিভিউতে বারবার আসা বিষয়।", "The rating patients left, and what the reviews keep mentioning.")} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <Reveal>
          <p className="font-mono text-[clamp(4.5rem,12vw,8rem)] font-medium leading-none tabular-nums text-ink-950">{SITE.rating.value.toFixed(1)}<span className="text-brass-500">★</span></p>
          <p className="mt-4 text-ink-950/75"><Mono>{fmt(SITE.rating.count)}+</Mono> {tr(bi("রিভিউ Google-এ", "reviews on Google"))}</p>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-ink mt-6">{tr(bi("Google Maps-এ রিভিউ দেখুন", "See reviews on Google Maps"))}<ArrowRight className="h-4 w-4" /></a>
        </Reveal>

        {REVIEWS.length > 0 && (
          <div>
            <div className="grid gap-4 md:grid-cols-3">
              {REVIEWS.map((r, i) => {
                const t = TREATMENTS.find((x) => x.slug === r.treatment);
                return (
                  <Reveal key={r.id} delay={i * 0.08} className="h-full">
                    <figure className="flex h-full flex-col rounded-xl border border-ink-950/10 bg-white p-6">
                      <figcaption className="text-sm font-medium text-lagoon-600">{r.kind === "theme" ? tr(bi("রিভিউয়ের বিষয়", "Review theme")) : r.author}</figcaption>
                      <blockquote className="mt-3 flex-1 text-ink-950/85">{r.kind === "quote" ? <>“<Tx b={r.text} />”</> : <Tx b={r.text} />}</blockquote>
                      {t && <Link href={`/treatments/${t.slug}`} className="mt-5 inline-flex min-h-12 items-center gap-1 text-sm font-medium text-brass-600 hover:underline">{tr(t.tab)}<ArrowRight className="h-4 w-4" /></Link>}
                    </figure>
                  </Reveal>
                );
              })}
            </div>
            {hasThemes && <p className="mt-5 text-sm text-ink-950/60">{tr(bi("এগুলো Google রিভিউ থেকে সারসংক্ষেপ করা বিষয়, হুবহু উদ্ধৃতি নয়।", "These are themes paraphrased from Google reviews, not verbatim quotes."))}</p>}
          </div>
        )}
      </div>
    </Section>
  );
}

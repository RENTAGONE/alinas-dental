"use client";

import type { LucideIcon } from "lucide-react";
import { Clock, MapPin, MessageCircle, Smile, Star, Quote } from "lucide-react";
import { bi, fmt, type Bi } from "@/lib/i18n";
import { STATS, TREATMENTS } from "@/lib/data";
import { SITE } from "@/lib/site";
import { useLang } from "./Providers";
import { Counter, Marquee, Reveal } from "./Reveal";
import { Rich } from "./ui";

const rating = SITE.rating.value.toFixed(1);

/** Only facts the client confirmed: rating, review count, address, hours, specialties, WhatsApp. */
const TRUST: { icon: LucideIcon; label: Bi }[] = [
  { icon: Star, label: bi(`Google-এ {{${rating}★}} রেটিং`, `{{${rating}★}} on Google`) },
  { icon: Quote, label: bi(`{{${fmt(SITE.rating.count)}+}} Google রিভিউ`, `{{${fmt(SITE.rating.count)}+}} Google reviews`) },
  { icon: MapPin, label: SITE.address },
  ...(SITE.hours.length > 0 ? [{ icon: Clock, label: SITE.hours[0] }] : []),
  { icon: Smile, label: bi(`{{${TREATMENTS.length}}}টি ক্লিনিক্যাল বিভাগ`, `{{${TREATMENTS.length}}} clinical specialties`) },
  { icon: MessageCircle, label: bi(`WhatsApp: {{${SITE.phoneLabel}}}`, `WhatsApp: {{${SITE.phoneLabel}}}`) },
];

export function TrustStats() {
  const { tr } = useLang();
  return (
    <section className="bg-ink-900 text-white">
      <div className="border-y border-white/10 py-5">
        <Marquee>
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label.en} className="flex shrink-0 items-center gap-3 text-white/85">
              <Icon className="h-5 w-5 text-brass-400" /><Rich text={tr(label)} />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
        {STATS.map((s, i) => (
          <Reveal key={s.label.en} delay={i * 0.08} className="lg:px-10 lg:first:pl-0">
            <p className="font-mono text-[clamp(2.4rem,5vw,4rem)] font-medium tabular-nums text-brass-300"><Counter to={s.to} decimals={s.decimals} suffix={s.suffix} /></p>
            <p className="mt-3 text-white/70">{tr(s.label)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

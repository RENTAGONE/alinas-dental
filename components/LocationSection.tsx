"use client";

import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { MAPS_LINK, SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { MapEmbed } from "./MapEmbed";
import { Reveal } from "./Reveal";
import { Mono, Section, SectionHead, Taka, Tx, type Tone } from "./ui";

export function LocationSection({ tone = "dark" }: { tone?: Tone }) {
  const { tr } = useLang();
  const dark = tone !== "light";
  const icon = "mt-1 h-5 w-5 shrink-0 text-brass-500";
  return (
    <Section tone={tone} id="location">
      <SectionHead dark={dark} title={bi("এভিনিউ-৫/১৭, মিরপুর-৬", "Avenue-5/17, Mirpur-6")} sub={SITE.address} />
      <Reveal className="mt-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className={cn("flex flex-col justify-between gap-8 rounded-xl border p-6 sm:p-7", dark ? "border-white/15" : "border-ink-950/15 bg-white")}>
          <div className="space-y-4">
            <p className="flex items-start gap-3"><MapPin className={icon} />{tr(SITE.address)}</p>
            {SITE.hours.length > 0 && <div className="flex items-start gap-3"><Clock className={icon} /><div>{SITE.hours.map((h) => <p key={h.en}><Tx b={h} /></p>)}</div></div>}
            <a href={`tel:${SITE.phone}`} className="flex min-h-12 items-center gap-3 font-mono tabular-nums"><Phone className="h-5 w-5 shrink-0 text-brass-500" />{SITE.phoneLabel}</a>
            {SITE.consultFee > 0 && <p className="text-sm">{tr(bi("কনসালটেশন ফি", "Consultation fee"))}: <Taka n={SITE.consultFee} /></p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={dark ? "btn-brass" : "btn-ink"}>{tr(bi("Google Maps-এ রুট দেখুন", "Get directions on Google Maps"))}</a>
            <a href={wa(`Assalamu Alaikum, I would like to visit ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          </div>
        </div>
        <MapEmbed className="min-h-[22rem] rounded-xl" />
      </Reveal>
    </Section>
  );
}

"use client";

import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { bi, type Bi } from "@/lib/i18n";
import { TREATMENTS } from "@/lib/data";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { GraceLotus } from "./GraceLotus";
import { Reveal } from "./Reveal";
import { Tx } from "./ui";

const PAGES: { href: string; label: Bi }[] = [
  { href: "/treatments", label: bi("সব ট্রিটমেন্ট", "All treatments") },
  { href: "/team", label: bi("ডেন্টাল টিম", "Dental team") },
  { href: "/process", label: bi("চিকিৎসা প্রক্রিয়া", "Treatment process") },
  { href: "/reviews", label: bi("Google রিভিউ", "Google reviews") },
  { href: "/contact", label: bi("যোগাযোগ", "Contact") },
];

export function Footer() {
  const { tr } = useLang();
  const head = "font-display text-lg font-semibold text-brass-300";
  return (
    <footer className="relative overflow-x-clip border-t border-brass-400/40 bg-ink-950 pb-28 pt-20 text-white md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 -bottom-6 select-none whitespace-nowrap text-center font-display text-[16vw] font-semibold leading-none text-white/[0.035]" aria-hidden>Dental Grace</div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <GraceLotus inView mark className="h-20 w-20 shrink-0" />
            <div>
              <p className="font-display text-3xl font-semibold">{SITE.name}</p>
              <p className="mt-1 text-white/65">{tr(bi("ডেন্টাল ইমপ্ল্যান্ট, রুট ক্যানেল, অর্থোডন্টিক্স ও অ্যাসথেটিক ডেন্টিস্ট্রি — মিরপুর-৬, ঢাকা।", "Dental implants, root canal, orthodontics and aesthetic dentistry, Mirpur-6, Dhaka."))}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={wa(`Assalamu Alaikum, I would like a chamber slot at ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            <a href={`tel:${SITE.phone}`} className="btn-ghost"><Phone className="h-4 w-4" /><span className="font-mono tabular-nums">{SITE.phoneLabel}</span></a>
          </div>
        </Reveal>

        <Reveal className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <p className={head}>{tr(bi("ট্রিটমেন্ট", "Treatments"))}</p>
            <ul className="mt-4">
              {TREATMENTS.map((t) => <li key={t.slug}><Link className="inline-flex min-h-12 items-center text-white/70 hover:text-white" href={`/treatments/${t.slug}`}>{tr(t.tab)}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className={head}>{tr(bi("ক্লিনিক", "Clinic"))}</p>
            <ul className="mt-4">
              {PAGES.map((p) => <li key={p.href}><Link className="inline-flex min-h-12 items-center text-white/70 hover:text-white" href={p.href}>{tr(p.label)}</Link></li>)}
            </ul>
          </div>
          <div className="space-y-4 text-white/70">
            <p className={head}>{tr(bi("চেম্বার", "Visit the chamber"))}</p>
            <p className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-brass-400" />{tr(SITE.address)}</p>
            {SITE.hours.length > 0 && <div className="flex gap-3"><Clock className="mt-1 h-4 w-4 shrink-0 text-brass-400" /><div>{SITE.hours.map((h) => <p key={h.en}><Tx b={h} /></p>)}</div></div>}
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <p>{tr(bi("এটি একটি ডেমো কনসেপ্ট সাইট।", "This is a demo concept site."))}</p>
        </div>
      </div>
    </footer>
  );
}

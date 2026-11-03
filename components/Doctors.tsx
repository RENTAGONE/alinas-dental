"use client";

import { MessageCircle } from "lucide-react";
import { bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { DOCTORS, SPECIALTIES } from "@/lib/data";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { Mono, Section, SectionHead, Tx, type Tone } from "./ui";

/** Credential-ledger cards. Add one DOCTORS entry per dentist (with a portrait) and the grid grows; years 0 and empty credentials stay hidden. */
export function Doctors({ withHead = true, tone = "light" }: { withHead?: boolean; tone?: Tone }) {
  const { tr } = useLang();
  const dark = tone !== "light";
  const label = cn("text-sm", dark ? "text-white/55" : "text-ink-950/55");
  return (
    <Section tone={tone}>
      {withHead && <SectionHead dark={dark} title={bi("ডেন্টাল টিম", "The dental team")} sub={bi("এভিনিউ-৫/১৭, মিরপুর-৬-এর চেম্বারে চীফ কনসালট্যান্ট ডেন্টাল সার্জন ও ক্লিনিক্যাল টিম।", "A chief consultant dental surgeon and clinical team at the Avenue-5/17, Mirpur-6 chamber.")} />}
      <div className={cn("grid gap-6", withHead && "mt-12", DOCTORS.length > 1 && "lg:grid-cols-2")}>
        {DOCTORS.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.08}>
            <article className={cn("grid overflow-hidden rounded-2xl border sm:grid-cols-[15rem_1fr]", dark ? "border-white/10 bg-white/[0.03]" : "border-ink-950/10 bg-white")}>
              <div className="relative">
                <Photo src={d.image} alt={tr(d.name)} art="team" className="aspect-[4/5] w-full sm:aspect-auto sm:h-full sm:min-h-[22rem]" />
                <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-brass-400" aria-hidden />
                <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-brass-400" aria-hidden />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className={cn("text-2xl", dark ? "text-white" : "text-ink-950")}>{tr(d.name)}</h3>
                <p className={cn("mt-1", dark ? "text-white/70" : "text-ink-950/70")}>{tr(d.role)}</p>
                <dl className={cn("mt-6 divide-y border-y", dark ? "divide-white/10 border-white/10" : "divide-ink-950/10 border-ink-950/10")}>
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
                    <dt className={label}>{tr(bi("ক্লিনিকের বিভাগ", "Clinic specialties"))}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((s) => <span key={s.en} className={cn("rounded-full border px-3 py-0.5 text-sm", dark ? "border-white/20" : "border-ink-950/20")}>{tr(s)}</span>)}
                    </dd>
                  </div>
                  {SITE.hours.length > 0 && (
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]"><dt className={label}>{tr(bi("চেম্বার", "Chamber"))}</dt><dd><Tx b={SITE.hours[0]} /></dd></div>
                  )}
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]"><dt className={label}>{tr(bi("ঠিকানা", "Location"))}</dt><dd>{tr(SITE.address)}</dd></div>
                  {d.years > 0 && (
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]"><dt className={label}>{tr(bi("অভিজ্ঞতা", "Experience"))}</dt><dd><Mono>{d.years}</Mono> {tr(bi("বছর", "years"))}</dd></div>
                  )}
                  {d.credentials.length > 0 && (
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]"><dt className={label}>{tr(bi("যোগ্যতা", "Credentials"))}</dt><dd>{d.credentials.map((c) => <p key={c.en}><Tx b={c} /></p>)}</dd></div>
                  )}
                </dl>
                <a href={wa(`Assalamu Alaikum, I would like to see the dental surgeon at ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className={cn("mt-6", dark ? "btn-ghost" : "btn-line")}>
                  <MessageCircle className="h-4 w-4" />{tr(bi("WhatsApp-এ সময় জিজ্ঞাসা করুন", "Ask for a time on WhatsApp"))}
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

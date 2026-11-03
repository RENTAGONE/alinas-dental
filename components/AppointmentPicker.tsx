"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, MessageCircle, RotateCcw } from "lucide-react";
import { bi, plain, takaRange, type Bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { SLOTS, TREATMENTS } from "@/lib/data";
import { dhakaNow, slotLabel } from "@/lib/dhaka";
import { BD_MOBILE, WINDOWS, cleanPhone, type LeadPayload, type WindowId } from "@/lib/lead";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { Mono, Section, SectionHead, Tx } from "./ui";
import type { Tone } from "./ui";

const STEPS: Bi[] = [bi("ট্রিটমেন্ট", "Treatment"), bi("সময়সীমা", "Window"), bi("সময়", "Time")];
const OPTION = "min-h-14 w-full rounded-lg border px-4 py-3 text-left transition-colors";
const IDLE = "border-white/15 bg-white/[0.03] text-white hover:border-brass-400/60";
const PICKED = "border-brass-400 bg-brass-400/10 text-white";

/**
 * Deterministic triage: three taps (treatment, window, time), then one dispatch that posts to /api/lead
 * and opens a WhatsApp message with the exact selections and the listed BDT range. No free-text AI, no guessing.
 */
export function AppointmentPicker({ tone = "dark" }: { tone?: Exclude<Tone, "light"> }) {
  const { tr, lang } = useLang();
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState<string | null>(null);
  const [win, setWin] = useState<WindowId | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const [sent, setSent] = useState(false);
  const [closedToday, setClosedToday] = useState(false);
  const opened = useRef(0);

  useEffect(() => {
    opened.current = Date.now();
    const sch = SITE.schedule;
    if (sch) setClosedToday(!sch.openDays.includes(dhakaNow().day));
  }, []);

  const t = TREATMENTS.find((x) => x.slug === slug) ?? null;
  const w = WINDOWS.find((x) => x.id === win) ?? null;
  const slot = SLOTS.find((x) => x.id === slotId) ?? null;
  const cleaned = cleanPhone(phone);
  const phoneOk = cleaned === "" || BD_MOBILE.test(cleaned);
  const ready = t !== null && w !== null && slot !== null;

  const reset = () => { setStep(0); setSlug(null); setWin(null); setSlotId(null); setSent(false); };

  let link = "";
  if (t && w && slot) {
    const range = `${takaRange(t.from, t.to)} ${tr(t.unit)}`;
    const lines = lang === "bn"
      ? [`আসসালামু আলাইকুম, আমি ${SITE.nameBn}-এ চেম্বার স্লটের অনুরোধ করছি।`, `ট্রিটমেন্ট: ${t.name.bn}`, `সময়সীমা: ${plain(w.label.bn)}`, `পছন্দের সময়: ${slotLabel(slot.from, slot.to)}`, `তালিকাভুক্ত পরিসর: ${range}`, cleaned ? `আমার নম্বর: ${cleaned}` : "", "সময় নিশ্চিত করবেন।"]
      : [`Assalamu Alaikum, I am requesting a chamber slot at ${SITE.name}.`, `Treatment: ${t.name.en}`, `Window: ${plain(w.label.en)}`, `Preferred time: ${slotLabel(slot.from, slot.to)}`, `Listed range: ${range}`, cleaned ? `My number: ${cleaned}` : "", "Please confirm a time."];
    link = wa(lines.filter(Boolean).join("\n"));
  }

  const dispatchLead = () => {
    if (!t || !w || !slot) return;
    const body: LeadPayload = { treatment: t.slug, window: w.id, slot: slot.id, phone: cleaned, lang, hp, elapsed: Date.now() - opened.current };
    void fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true }).catch(() => undefined);
    setSent(true);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Section tone={tone} id="book">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <SectionHead dark title={bi("চেম্বার স্লট দেখুন", "Check chamber slot")} sub={bi("তিনটি ট্যাপ, তারপর আপনার বাছাই করা তথ্য সহ WhatsApp খুলবে। এটি অনুরোধ, নিশ্চিত বুকিং নয়।", "Three taps, then WhatsApp opens with your choices filled in. This is a request, not a confirmed booking.")} />
          {SITE.hours.length > 0 && <p className="mt-8 text-white/80"><Tx b={SITE.hours[0]} /></p>}
          <a href={`tel:${SITE.phone}`} className="mt-2 inline-flex min-h-12 items-center font-mono tabular-nums text-brass-300">{SITE.phoneLabel}</a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5 sm:p-8">
          <ol className="grid grid-cols-3 gap-2" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li key={s.en} aria-current={step === i ? "step" : undefined}>
                <span className={cn("block h-1 rounded-full transition-colors", i <= step ? "bg-brass-400" : "bg-white/15")} />
                <span className={cn("mt-2 block text-sm", i <= step ? "text-white" : "text-white/50")}><Mono>{i + 1}</Mono> {tr(s)}</span>
              </li>
            ))}
          </ol>

          <div className="mt-7 min-h-[22rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {step === 0 && (
                  <>
                    <h3 className="text-xl text-white">{tr(bi("কোন ট্রিটমেন্ট দরকার?", "Which treatment do you need?"))}</h3>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {TREATMENTS.map((x) => (
                        <button key={x.slug} type="button" aria-pressed={slug === x.slug} onClick={() => { setSlug(x.slug); setStep(1); }} className={cn(OPTION, slug === x.slug ? PICKED : IDLE)}>
                          <span className="block font-medium">{tr(x.tab)}</span>
                          <span className="mt-0.5 block text-sm text-white/65"><Mono>{takaRange(x.from, x.to)}</Mono> {tr(x.unit)}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className="text-xl text-white">{tr(bi("কখন আসতে চান?", "When would you like to come?"))}</h3>
                    <div className="mt-5 grid gap-2">
                      {WINDOWS.map((x) => (
                        <button key={x.id} type="button" aria-pressed={win === x.id} onClick={() => { setWin(x.id); setStep(2); }} className={cn(OPTION, win === x.id ? PICKED : IDLE)}>
                          <span className="block font-medium"><Tx b={x.label} /></span>
                          <span className="mt-0.5 block text-sm text-white/65"><Tx b={x.hint} /></span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="text-xl text-white">{tr(bi("কোন সময়টি সুবিধাজনক?", "Which time suits you?"))}</h3>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {SLOTS.map((x) => (
                        <button key={x.id} type="button" aria-pressed={slotId === x.id} onClick={() => { setSlotId(x.id); setStep(3); }} className={cn(OPTION, slotId === x.id ? PICKED : IDLE)}>
                          <Mono className="text-lg">{slotLabel(x.from, x.to)}</Mono>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && t && w && slot && (
                  <>
                    <h3 className="text-xl text-white">{tr(bi("আপনার অনুরোধ", "Your request"))}</h3>
                    <dl className="mt-5 divide-y divide-white/10 border-y border-white/10 text-white">
                      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="text-white/65">{tr(bi("ট্রিটমেন্ট", "Treatment"))}</dt><dd className="text-right">{tr(t.name)}</dd></div>
                      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="text-white/65">{tr(bi("সময়সীমা", "Window"))}</dt><dd><Tx b={w.label} /></dd></div>
                      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="text-white/65">{tr(bi("সময়", "Time"))}</dt><dd><Mono>{slotLabel(slot.from, slot.to)}</Mono></dd></div>
                      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="text-white/65">{tr(bi("তালিকাভুক্ত পরিসর", "Listed range"))}</dt><dd><Mono className="text-brass-300">{takaRange(t.from, t.to)}</Mono> <span className="text-white/65">{tr(t.unit)}</span></dd></div>
                    </dl>
                    {w.id === "soon" && closedToday && (
                      <p className="mt-4 text-sm text-brass-300">{tr(bi("আজ চেম্বার বন্ধ। অনুরোধ পরবর্তী খোলা দিনের জন্য যাবে।", "The chamber is closed today. Your request goes to the next open day."))}</p>
                    )}

                    <label className="mt-6 block text-sm text-white/75" htmlFor="lead-phone">{tr(bi("আপনার মোবাইল নম্বর (ঐচ্ছিক)", "Your mobile number (optional)"))}</label>
                    <input id="lead-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={!phoneOk}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-ink-950 px-4 font-mono tabular-nums text-white placeholder:text-white/35" />
                    {!phoneOk && <p className="mt-2 text-sm text-brass-300">{tr(bi("বাংলাদেশি মোবাইল নম্বর দিন, যেমন 01XXXXXXXXX।", "Enter a Bangladesh mobile number such as 01XXXXXXXXX."))}</p>}
                    <input value={hp} onChange={(e) => setHp(e.target.value)} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="pointer-events-none absolute h-0 w-0 opacity-0" />

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {ready && phoneOk ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" onClick={dispatchLead} className="btn-wa"><MessageCircle className="h-4 w-4" />{tr(bi("WhatsApp-এ অনুরোধ পাঠান", "Send request on WhatsApp"))}</a>
                      ) : (
                        <button type="button" disabled className="btn-wa opacity-50"><MessageCircle className="h-4 w-4" />{tr(bi("WhatsApp-এ অনুরোধ পাঠান", "Send request on WhatsApp"))}</button>
                      )}
                      <button type="button" onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" />{tr(bi("নতুন করে শুরু", "Start over"))}</button>
                    </div>
                    {sent && (
                      <p role="status" className="mt-4 flex items-center gap-2 text-sm text-lagoon-300"><Check className="h-4 w-4" />{tr(bi("অনুরোধ নথিভুক্ত হয়েছে। WhatsApp-এ আপনার বাছাই করা তথ্য দেওয়া আছে।", "Request logged. WhatsApp opens with your choices filled in."))}</p>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step > 0 && step < 4 && (
            <button type="button" onClick={back} className="mt-4 inline-flex min-h-12 items-center gap-2 text-sm text-white/75 hover:text-white"><ArrowLeft className="h-4 w-4" />{tr(bi("পেছনে", "Back"))}</button>
          )}
        </div>
      </div>
    </Section>
  );
}

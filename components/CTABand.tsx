"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { bi } from "@/lib/i18n";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { GraceLotus } from "./GraceLotus";
import { Magnetic, Reveal } from "./Reveal";
import { Tx } from "./ui";

/** Teal band between dark sections: the clinic's one clear next step. */
export function CTABand() {
  const { tr } = useLang();
  return (
    <section className="relative overflow-x-clip bg-lagoon-600 px-5 py-20 text-white sm:px-8 sm:py-24">
      <GraceLotus inView tone="brass" className="pointer-events-none absolute -right-10 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 opacity-35 md:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal>
          <h2 className="text-[clamp(2rem,4.4vw,3.6rem)] text-white">{tr(bi("চেম্বার স্লট দেখুন", "Check chamber slot"))}</h2>
          {SITE.hours.length > 0 && <p className="mt-4 text-lg text-white"><Tx b={SITE.hours[0]} /></p>}
          <p className="mt-3 max-w-xl text-lg text-white/90">{tr(bi("ট্রিটমেন্টের নাম পাঠান, ক্লিনিক সময় নিশ্চিত করবে।", "Send the treatment you need and the clinic confirms a time."))}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Magnetic><Link href="/contact#book" className="btn-brass">{tr(bi("স্লটের অনুরোধ করুন", "Request a slot"))}<ArrowRight className="h-4 w-4" /></Link></Magnetic>
          <a href={wa(`Assalamu Alaikum, I would like a chamber slot at ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        </Reveal>
      </div>
    </section>
  );
}

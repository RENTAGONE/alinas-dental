"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { bi, fmt, takaRange } from "@/lib/i18n";
import { TREATMENTS } from "@/lib/data";
import { MAPS_LINK, SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { GraceLotus } from "./GraceLotus";
import { LiveStatus } from "./LiveStatus";
import { Photo } from "./Photo";
import { Magnetic, SOFT } from "./Reveal";
import { Mono, Rich } from "./ui";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const rise: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: SOFT } } };

const TILE = "relative overflow-hidden rounded-2xl border border-white/10";

/** H04: 6:6 asymmetric bento mosaic on the right, live Mirpur-6 chamber pill on the left. */
export function Hero() {
  const { tr, ready } = useLang();
  const show = ready ? "show" : "hidden";
  const lead = TREATMENTS.find((t) => t.slug === "veneers") ?? TREATMENTS[0];
  const price = TREATMENTS.find((t) => t.slug === "rct-crown") ?? TREATMENTS[1] ?? TREATMENTS[0];

  return (
    <section className="relative overflow-x-clip bg-ink-950 pb-16 pt-36 text-white sm:pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_88%_12%,rgb(var(--ink-700)/0.6),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <motion.div variants={stagger} initial="hidden" animate={show} className="flex flex-col items-start lg:col-span-6">
          <motion.div variants={rise}><LiveStatus /></motion.div>
          <motion.h1 variants={rise} className="mt-7 text-[clamp(2.5rem,6vw,5rem)] text-white">
            {tr(bi("ইমপ্ল্যান্ট, রুট ক্যানেল, ব্রেসেস।", "Implants, root canal, braces."))}
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl text-lg text-white/75">
            {tr(bi("ইমপ্ল্যান্ট, রুট ক্যানেল, অর্থোডন্টিক ও অ্যাসথেটিক ডেন্টিস্ট্রি — এভিনিউ-৫/১৭, মিরপুর-৬, ঢাকা।", "Implant, root canal, orthodontic and aesthetic dentistry at Avenue-5/17, Mirpur-6, Dhaka."))}
          </motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic><Link href="/#book" className="btn-brass">{tr(bi("চেম্বার স্লট দেখুন", "Check chamber slot"))}<ArrowRight className="h-4 w-4" /></Link></Magnetic>
            <a href={wa(`Assalamu Alaikum, I have a question for ${SITE.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4" />{tr(bi("WhatsApp-এ জিজ্ঞাসা করুন", "Ask on WhatsApp"))}</a>
          </motion.div>
          {SITE.hours.length > 0 && (
            <motion.p variants={rise} className="mt-6 text-sm text-white/65"><Rich text={tr(SITE.hours[0])} /></motion.p>
          )}
          <motion.div variants={rise} className="mt-3">
            <Link href="/#treatments" className="inline-flex min-h-12 items-center text-sm text-brass-300 underline-offset-4 hover:underline">{tr(bi("চিকিৎসাভিত্তিক খরচের পরিসর দেখুন", "See the cost range for each treatment"))}</Link>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate={show} className="grid grid-cols-2 gap-3 sm:auto-rows-[8rem] sm:grid-cols-6 lg:col-span-6 lg:auto-rows-[8.5rem]">
          <motion.div variants={rise} className={`${TILE} col-span-2 max-sm:aspect-[4/3] sm:col-span-4 sm:row-span-3`}>
            <Link href={`/treatments/${lead.slug}`} className="group absolute inset-0 block" aria-label={tr(lead.name)}>
              <div className="absolute inset-0"><Photo src={lead.image} alt={tr(lead.name)} art={lead.art} priority className="h-full w-full" /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-xl text-white">{tr(lead.tab)}</p>
                <p className="mt-1 text-sm text-white/80"><Mono className="text-brass-300">{takaRange(lead.from, lead.to)}</Mono> {tr(lead.unit)}</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={rise} className={`${TILE} col-span-1 flex items-center justify-center bg-ink-800 p-3 max-sm:aspect-square sm:col-span-2 sm:row-span-2`}>
            {ready && <GraceLotus delay={0.5} className="h-full max-h-56 w-full" />}
          </motion.div>

          <motion.div variants={rise} className={`${TILE} col-span-1 flex flex-col justify-between border-brass-400 bg-brass-400 p-4 text-ink-950 sm:col-span-2`}>
            <p className="text-sm font-medium">{tr(bi("Google রেটিং", "Google rating"))}</p>
            <div>
              <p className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">{SITE.rating.value.toFixed(1)}<span className="text-2xl">★</span></p>
              <p className="mt-1 text-sm"><Mono>{fmt(SITE.rating.count)}+</Mono> {tr(bi("রিভিউ", "reviews"))}</p>
            </div>
          </motion.div>

          <motion.div variants={rise} className={`${TILE} col-span-2 bg-ink-900 sm:col-span-3`}>
            <Link href={`/treatments/${price.slug}`} className="flex h-full min-h-28 flex-col justify-between p-4 sm:p-5">
              <p className="text-sm text-white/70">{tr(price.name)}</p>
              <p className="mt-3"><Mono className="text-xl text-brass-300 sm:text-2xl">{takaRange(price.from, price.to)}</Mono> <span className="text-sm text-white/65">{tr(price.unit)}</span></p>
            </Link>
          </motion.div>

          <motion.div variants={rise} className={`${TILE} col-span-2 border-lagoon-600 bg-lagoon-600 sm:col-span-3`}>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex h-full min-h-28 flex-col justify-between p-4 sm:p-5">
              <MapPin className="h-5 w-5 text-white" />
              <div>
                <p className="font-display text-lg text-white">{tr(SITE.address)}</p>
                <p className="mt-1 text-sm text-white/85">{tr(bi("Google Maps-এ খুলুন", "Open in Google Maps"))}</p>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

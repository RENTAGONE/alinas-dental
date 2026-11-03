"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { bi, takaRange } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { TIERS, tierRange, type Tier, type Treatment } from "@/lib/data";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { Mono } from "./ui";

export type TierId = Tier["id"];

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;

/** Tier toggle with a shared-layout pill. The range updates live and the WhatsApp button carries this exact treatment and tier. */
export function TierEstimator({ t, tierId, onChange, tone = "light" }: { t: Treatment; tierId: TierId; onChange: (id: TierId) => void; tone?: "dark" | "light" }) {
  const { tr, lang } = useLang();
  const dark = tone === "dark";
  const tier = TIERS.find((x) => x.id === tierId) ?? TIERS[0];
  const r = tierRange(t, tier);
  const range = takaRange(r.from, r.to);
  const msg = lang === "bn"
    ? `আসসালামু আলাইকুম, আমি ${SITE.nameBn}-এ ${t.name.bn} (${tier.name.bn} স্তর) সম্পর্কে জানতে চাই। তালিকাভুক্ত পরিসর: ${range} ${t.unit.bn}। চেম্বার স্লট জানাবেন।`
    : `Assalamu Alaikum, I am checking ${t.name.en} (${tier.name.en} tier) at ${SITE.name}. Listed range: ${range} ${t.unit.en}. Please confirm a chamber slot.`;

  return (
    <div className={cn("rounded-xl border p-5", dark ? "border-white/15 bg-white/[0.04]" : "border-ink-950/15 bg-white")}>
      <div role="group" aria-label={tr(bi("মূল্যস্তর", "Price tier"))} className={cn("grid grid-cols-3 rounded-lg p-1", dark ? "bg-white/10" : "bg-ink-950/[0.06]")}>
        {TIERS.map((x) => {
          const active = x.id === tierId;
          return (
            <button key={x.id} type="button" aria-pressed={active} onClick={() => onChange(x.id)} className="relative min-h-12 rounded-md px-1 text-sm font-semibold">
              {active && <motion.span layoutId="activeTierPill" className={cn("absolute inset-0 rounded-md", dark ? "bg-brass-400" : "bg-ink-950")} transition={SPRING} />}
              <span className={cn("relative", active ? (dark ? "text-ink-950" : "text-white") : dark ? "text-white/75" : "text-ink-950/70")}>{tr(x.name)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${t.slug}-${tierId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
            <p className={cn("text-[clamp(1.35rem,5.2vw,2rem)] font-semibold", dark ? "text-brass-300" : "text-ink-950")}><Mono>{range}</Mono></p>
            <p className={cn("mt-1 text-sm", dark ? "text-white/70" : "text-ink-950/65")}>{tr(t.unit)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className={cn("mt-3 text-sm", dark ? "text-white/60" : "text-ink-950/60")}>
        {tr(bi("স্তরগুলো ক্লিনিকের তালিকাভুক্ত পরিসরকে তিন ভাগে ভাগ করে। চূড়ান্ত খরচ পরীক্ষার পর নিশ্চিত হয়।", "Tiers split the clinic’s listed range into three bands. The final cost is confirmed after examination."))}
      </p>
      <a href={wa(msg)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5 w-full sm:w-auto">
        <MessageCircle className="h-4 w-4" />{tr(bi("এই পরিসর WhatsApp-এ পাঠান", "Send this range on WhatsApp"))}
      </a>
    </div>
  );
}

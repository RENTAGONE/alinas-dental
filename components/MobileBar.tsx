"use client";

import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { bi } from "@/lib/i18n";
import { SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";

/** Sticky action bar for phones: call, check slot (the main action, in brass), WhatsApp. */
export function MobileBar() {
  const { tr } = useLang();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brass-400/30 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_1.5fr_1fr]">
        <a href={`tel:${SITE.phone}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium text-white">
          <Phone className="h-5 w-5 text-lagoon-300" />{tr(bi("কল", "Call"))}
        </a>
        <Link href="/contact#book" className="flex min-h-14 items-center justify-center gap-2 bg-brass-400 px-2 text-sm font-semibold text-ink-950">
          <CalendarCheck className="h-5 w-5" />{tr(bi("চেম্বার স্লট", "Check slot"))}
        </Link>
        <a href={wa(`Assalamu Alaikum, I found ${SITE.name} on your website.`)} target="_blank" rel="noopener noreferrer" className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium text-white">
          <MessageCircle className="h-5 w-5 text-emerald-400" />WhatsApp
        </a>
      </div>
    </div>
  );
}

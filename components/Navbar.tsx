"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Languages, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { bi, type Bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { MAPS_LINK, SITE, wa } from "@/lib/site";
import { useLang } from "./Providers";
import { GraceLotus } from "./GraceLotus";
import { LiveStatus } from "./LiveStatus";
import { SOFT } from "./Reveal";

const LINKS: { href: string; label: Bi }[] = [
  { href: "/treatments", label: bi("ট্রিটমেন্ট", "Treatments") },
  { href: "/team", label: bi("ডেন্টাল টিম", "Team") },
  { href: "/process", label: bi("চিকিৎসা প্রক্রিয়া", "Treatment process") },
  { href: "/reviews", label: bi("রিভিউ", "Reviews") },
  { href: "/contact", label: bi("যোগাযোগ", "Contact") },
];

/**
 * N03: Dual-deck header. Deck 1 is the utility bar (Mirpur-6 address, live chamber status, phone);
 * deck 2 is the main navigation. Scrolling slides deck 1 away (transform only) and deck 2 stays.
 */
export function Navbar() {
  const { lang, setLang, tr, ready } = useLang();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  const isActive = (href: string): boolean => path === href || path.startsWith(`${href}/`);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out", scrolled && !open ? "-translate-y-9 md:-translate-y-12" : "translate-y-0")}>
        <motion.div initial={{ y: -40, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }} transition={{ duration: 0.8, ease: SOFT }}>
          <div className="h-9 border-b border-white/10 bg-ink-950 text-white md:h-12">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-6 px-4 text-xs sm:px-8 md:justify-between">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hidden min-h-12 items-center gap-2 text-white/75 hover:text-white md:flex">
                <MapPin className="h-3.5 w-3.5 text-brass-400" />{tr(SITE.address)}
              </a>
              <LiveStatus bare />
              <a href={`tel:${SITE.phone}`} className="hidden min-h-12 items-center gap-2 font-mono tabular-nums text-white/80 hover:text-white md:flex">
                <Phone className="h-3.5 w-3.5 text-brass-400" />{SITE.phoneLabel}
              </a>
            </div>
          </div>

          <div className={cn("border-b border-white/10 backdrop-blur-xl transition-colors duration-500", scrolled || open ? "bg-ink-950/95" : "bg-ink-950/75")}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 md:h-[4.5rem]">
              <Link href="/" className="flex min-h-12 items-center gap-3 text-white" aria-label={`${SITE.name} home`}>
                <GraceLotus still mark className="h-10 w-10 shrink-0" />
                <span className="font-display text-lg font-semibold sm:text-xl">{SITE.name}</span>
              </Link>

              <nav className="hidden items-center lg:flex" aria-label="Main">
                {LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className={cn("relative flex min-h-12 items-center px-4 text-sm transition-colors", isActive(l.href) ? "text-white" : "text-white/70 hover:text-white")}>
                    {tr(l.label)}
                    {isActive(l.href) && <span className="absolute inset-x-4 bottom-2 h-px bg-brass-400" />}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={() => setLang(lang === "bn" ? "en" : "bn")} className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-md px-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:px-3" aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}>
                  <Languages className="h-4 w-4" /><span className="hidden sm:inline">{lang === "bn" ? "English" : "বাংলা"}</span>
                </button>
                <Link href="/contact#book" className="btn-brass hidden !py-2 text-sm lg:inline-flex">{tr(bi("চেম্বার স্লট দেখুন", "Check chamber slot"))}</Link>
                <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} className="flex h-12 w-12 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[35] overflow-y-auto bg-ink-950 px-5 pb-10 pt-28 lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i, duration: 0.5, ease: SOFT }}>
                  <Link href={l.href} className="flex min-h-16 items-center border-b border-white/10 font-display text-3xl text-white">{tr(l.label)}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-8 space-y-3 text-white/75">
              <p className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-brass-400" />{tr(SITE.address)}</p>
              <a href={`tel:${SITE.phone}`} className="flex min-h-12 items-center gap-3 font-mono tabular-nums"><Phone className="h-4 w-4 text-brass-400" />{SITE.phoneLabel}</a>
            </div>
            <div className="mt-6 grid gap-3">
              <Link href="/contact#book" className="btn-brass w-full">{tr(bi("চেম্বার স্লট দেখুন", "Check chamber slot"))}</Link>
              <a href={wa("Assalamu Alaikum")} target="_blank" rel="noopener noreferrer" className="btn-wa w-full"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

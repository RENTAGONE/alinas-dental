"use client";

/**
 * app/page.tsx — Alina’s Dental Grace · Mirpur-6 (Avenue-5/17), Dhaka
 * Track A · Archetype A (Swiss Clinical Minimalist)
 *
 * Stages: HeroAuthorityAnchor → InfrastructureTrustStrip → AsymmetricBentoGrid
 *         → PrincipalAuthorityRoster → VerifiedOutcomes → VaultPreviewBanner
 * Requires: next, react, framer-motion, lucide-react, tailwindcss,
 *           and @/utils/dhakaFormatters (formatBDT, formatLakhCrore, MASTER_SPRING).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Landmark,
  Lock,
  MapPin,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Inter, JetBrains_Mono } from "next/font/google";
import {
  formatBDT,
  formatLakhCrore,
  MASTER_SPRING,
} from "../utils/dhakaFormatters";

/* ────────────────────────────────────────────────────────────────────────────
 * Fonts & shared tokens
 * ──────────────────────────────────────────────────────────────────────────── */

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-adg-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-adg-mono",
  display: "swap",
});

const MONO = "font-[family-name:var(--font-adg-mono)] tabular-nums";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600";
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hover / tap micro-interactions — every one runs on MASTER_SPRING. */
const BTN = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: MASTER_SPRING,
};
const LIFT = {
  whileHover: { y: -4 },
  whileTap: { scale: 0.99 },
  transition: MASTER_SPRING,
};
const LIFT_SOFT = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.995 },
  transition: MASTER_SPRING,
};

/* ────────────────────────────────────────────────────────────────────────────
 * Clinic data
 * ──────────────────────────────────────────────────────────────────────────── */

const CLINIC = {
  name: "Alina’s Dental Grace",
  zone: "Mirpur-6",
  address: "Avenue-5/17, Mirpur-6, Dhaka",
  whatsappNumber: "8801533835136",
  whatsappDisplay: "+880 1533-835136",
  googleReviews: 161,
  careerProcedures: 6200,
  openLabel: "5:00 PM",
  closeLabel: "10:30 PM",
  openMinutes: 17 * 60,
  closeMinutes: 22 * 60 + 30,
} as const;

const PRICING = {
  osstemSingle: 48_000,
  straumannSingle: 120_000,
  zirconiaCrown: 12_000,
  singleSiteCeiling: 185_000,
  emiTenures: [3, 6, 12],
} as const;

const EMI_BANKS = "City Bank Amex • BRAC • EBL • SCB";

const LAKH = 100_000;
/** Lakh-format for 1,00,000+, plain BDT grouping below it. */
function money(amount: number): string {
  return amount >= LAKH ? formatLakhCrore(amount) : formatBDT(amount);
}

/* ────────────────────────────────────────────────────────────────────────────
 * WhatsApp deep links (pre-filled, URL-encoded)
 * ──────────────────────────────────────────────────────────────────────────── */

function buildWhatsAppHref(lines: readonly string[]): string {
  return `https://wa.me/${CLINIC.whatsappNumber}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

const WA = {
  priority: buildWhatsAppHref([
    `Hello ${CLINIC.name},`,
    "I want a priority consultation for a titanium implant with 3D CBCT planning.",
    `Package I saw: from ${formatBDT(PRICING.osstemSingle)} with 0% EMI.`,
    "",
    "My name:",
    "Preferred day (Sat–Thu):",
  ]),
  book: buildWhatsAppHref([
    `Hello ${CLINIC.name},`,
    "I would like to book a 3D CBCT implant planning slot at Mirpur-6.",
    "",
    "My name:",
    "Preferred day (Sat–Thu):",
  ]),
  straumann: buildWhatsAppHref([
    `Hello ${CLINIC.name},`,
    `Please quote the Straumann SLActive tier (from ${money(PRICING.straumannSingle)} per site) with 0% EMI.`,
    "",
    "Teeth to replace:",
    "My name:",
  ]),
  osstem: buildWhatsAppHref([
    `Hello ${CLINIC.name},`,
    `Please quote the Osstem TS-Series tier (from ${formatBDT(PRICING.osstemSingle)} per site) with 0% EMI.`,
    "",
    "Teeth to replace:",
    "My name:",
  ]),
  vault: buildWhatsAppHref([
    `Hello ${CLINIC.name},`,
    "Please lock my 0% EMI estimate and a priority consultation slot.",
    "",
    "Treatment:",
    "Preferred EMI tenure (3 / 6 / 12 months):",
    "My name:",
  ]),
} as const;

/* ────────────────────────────────────────────────────────────────────────────
 * Chamber hours — computed on Asia/Dhaka time, client-side only
 * ──────────────────────────────────────────────────────────────────────────── */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type DayKey = (typeof DAYS)[number];

const WEEK: ReadonlyArray<{ key: DayKey; label: string }> = [
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
];

function isDayKey(value: string): value is DayKey {
  return (DAYS as readonly string[]).includes(value);
}

interface ChamberStatus {
  isOpen: boolean;
  today: DayKey;
  label: string;
}

function readChamberStatus(now: Date): ChamberStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  const weekday = read("weekday");
  const today: DayKey = isDayKey(weekday) ? weekday : "Sat";
  const minutes = (Number(read("hour")) % 24) * 60 + Number(read("minute"));
  const worksToday = today !== "Fri";

  if (
    worksToday &&
    minutes >= CLINIC.openMinutes &&
    minutes < CLINIC.closeMinutes
  ) {
    return {
      isOpen: true,
      today,
      label: `OPEN NOW · CLOSES ${CLINIC.closeLabel}`,
    };
  }
  if (worksToday && minutes < CLINIC.openMinutes) {
    return {
      isOpen: false,
      today,
      label: `CLOSED · OPENS TODAY ${CLINIC.openLabel}`,
    };
  }
  const dayIndex = DAYS.indexOf(today);
  for (let step = 1; step <= 7; step += 1) {
    const next = DAYS[(dayIndex + step) % 7];
    if (next !== undefined && next !== "Fri") {
      const when = step === 1 ? "TOMORROW" : next.toUpperCase();
      return {
        isOpen: false,
        today,
        label: `CLOSED · OPENS ${when} ${CLINIC.openLabel}`,
      };
    }
  }
  return {
    isOpen: false,
    today,
    label: `CLOSED · OPENS SAT ${CLINIC.openLabel}`,
  };
}

function useChamberStatus(): ChamberStatus | null {
  const [status, setStatus] = useState<ChamberStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(readChamberStatus(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Primitives
 * ──────────────────────────────────────────────────────────────────────────── */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`h-full ${className}`}>
      {children}
    </div>
  );
}


/** Border emphasis via opacity only (no layout or paint-heavy transitions). */
function HoverRing({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 ring-inset transition-opacity duration-300 group-hover:opacity-100 ${
        dark ? "ring-cyan-400/60" : "ring-cyan-600/50"
      }`}
    />
  );
}

type CtaVariant = "emerald" | "emeraldOnDark" | "ink" | "outline";

const CTA_STYLES: Record<CtaVariant, string> = {
  emerald: "bg-emerald-700 text-white hover:bg-emerald-800",
  emeraldOnDark: "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
  ink: "bg-slate-950 text-white hover:bg-slate-800",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:border-slate-400",
};

function CtaLink({
  href,
  variant,
  children,
  className = "",
  external = true,
  ariaLabel,
  size = "default",
}: {
  href: string;
  variant: CtaVariant;
  children: ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  size?: "default" | "icon";
}) {
  return (
    <motion.a
      {...BTN}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold will-change-transform ${
        size === "icon" ? "w-12" : "px-5"
      } ${CTA_STYLES[variant]} ${FOCUS} ${className}`}
    >
      {children}
    </motion.a>
  );
}

/**
 * Count-up that renders the final value by default, so it can never stay
 * stuck at 0 (mobile observers, reduced motion, JS timing). When the element
 * scrolls into view it replays 0 → target.
 */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState<number>(to);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to]);

  return (
    <span ref={ref} className={MONO}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Header
 * ──────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "#systems", label: "Systems" },
  { href: "#roster", label: "Roster" },
  { href: "#outcomes", label: "Outcomes" },
  { href: "#vault", label: "EMI Vault" },
] as const;

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          aria-label={`${CLINIC.name} — back to top`}
          className={`flex items-center gap-3 rounded-md ${FOCUS}`}
        >
          <span
            aria-hidden
            className={`grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-xs font-semibold text-white ${MONO}`}
          >
            AG
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-slate-950">
              {CLINIC.name}
            </span>
            <span
              className={`block text-[10px] uppercase tracking-[0.14em] text-slate-500 ${MONO}`}
            >
              {CLINIC.zone} · Implant Dentistry
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              {...LIFT_SOFT}
              href={link.href}
              className={`inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-medium text-slate-600 hover:text-slate-950 ${FOCUS}`}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="hidden sm:block">
          <CtaLink href={WA.book} variant="emerald">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp Priority Line
          </CtaLink>
        </div>
        <div className="sm:hidden">
          <CtaLink
            href={WA.book}
            variant="emerald"
            size="icon"
            ariaLabel="Open WhatsApp to book a consultation"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
          </CtaLink>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Stage 1 — HeroAuthorityAnchor (asymmetric 7:5)
 * ──────────────────────────────────────────────────────────────────────────── */

const GRID_BACKGROUND = {
  backgroundImage:
    "linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px)",
  backgroundSize: "calc(100% / 12) 100%",
  maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
} as const;

const HERO_LEDGER = [
  { label: "Imaging", value: "3D CBCT" },
  { label: "Systems", value: "Straumann® · Osstem®" },
  { label: "Chamber", value: "Mirpur-6, Avenue-5/17" },
] as const;

function HeroAuthorityAnchor() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-slate-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={GRID_BACKGROUND}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        {/* Left — 7 columns */}
        <div className="lg:col-span-7">
          <Reveal>
            <div
              className={`inline-flex max-w-full items-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-[10px] uppercase leading-snug tracking-[0.1em] text-slate-700 shadow-sm sm:items-center sm:rounded-full sm:text-[11px] sm:tracking-[0.14em] ${MONO}`}
            >
              <span aria-hidden>[</span>
              <span className="relative mt-[3px] flex h-2 w-2 shrink-0 sm:mt-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>LIVE CHAMBER: MIRPUR-6 • CLINICAL TRIAGE PORTAL</span>
              <span aria-hidden>]</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              id="hero-heading"
              className="mt-7 text-[2.25rem] font-semibold leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.75rem]"
            >
              <span className="block">3D CBCT-guided Swiss titanium implants.</span>
              <span className="mt-1 block text-cyan-700">
                0.1mm nerve-safe margin.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Implant planning on a 3D CBCT scan, placement through a printed
              surgical guide, restoration in zirconia. Straumann® and Osstem®
              systems. 0% EMI on partner bank cards.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={WA.book} variant="ink" className="sm:min-w-64">
                <MessageCircle className="h-4 w-4" aria-hidden />
                Book 3D CBCT Planning Slot
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </CtaLink>
              <CtaLink href="#systems" variant="outline" external={false}>
                Compare implant tiers
              </CtaLink>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <dl className="mt-12 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
              {HERO_LEDGER.map((item) => (
                <div key={item.label}>
                  <dt
                    className={`text-[10px] uppercase tracking-[0.16em] text-slate-500 ${MONO}`}
                  >
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-1.5 text-sm font-medium text-slate-900 ${MONO}`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Right — 5 columns */}
        <div className="lg:col-span-5">
          <Reveal delay={0.2}>
            <TelemetryPreviewCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TelemetryPreviewCard() {
  return (
    <motion.aside
      {...LIFT_SOFT}
      aria-label="Starting package valuation and 0% EMI summary"
      className="relative h-full overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-900/10 ring-1 ring-slate-900/10 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-[10px] uppercase tracking-[0.18em] text-cyan-400 ${MONO}`}
          >
            Telemetry preview
          </p>
          <span
            className={`rounded-md border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300 ${MONO}`}
          >
            Single site · Osstem® TS
          </span>
        </div>

        <p
          className={`mt-8 text-[11px] uppercase tracking-[0.16em] text-slate-400 ${MONO}`}
        >
          Starting package valuation
        </p>
        <p
          className={`mt-2 text-5xl font-medium tracking-tight sm:text-6xl ${MONO}`}
        >
          {formatBDT(PRICING.osstemSingle)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Implant, abutment and zirconia crown. Final quote issued after the 3D
          CBCT scan.
        </p>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <p
              className={`text-[11px] uppercase tracking-[0.16em] text-slate-300 ${MONO}`}
            >
              0% EMI summary
            </p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-300 ${MONO}`}
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              0% interest
            </span>
          </div>

          <ul className="mt-3 divide-y divide-white/10">
            {PRICING.emiTenures.map((months) => (
              <li
                key={months}
                className={`flex items-center justify-between py-2.5 text-sm ${MONO}`}
              >
                <span className="text-slate-400">{months} months</span>
                <span className="font-medium text-white">
                  {formatBDT(PRICING.osstemSingle / months)}
                  <span className="text-slate-500"> / mo</span>
                </span>
              </li>
            ))}
          </ul>

          <p
            className={`mt-3 border-t border-white/10 pt-3 text-[11px] uppercase tracking-[0.1em] text-slate-400 ${MONO}`}
          >
            {EMI_BANKS}
          </p>
        </div>

        <CtaLink
          href={WA.priority}
          variant="emeraldOnDark"
          className="mt-6 w-full"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          VIP WhatsApp Priority Dispatch
        </CtaLink>
        <p className="mt-3 text-center text-xs text-slate-500">
          EMI subject to partner bank card approval.
        </p>
      </div>
    </motion.aside>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Stage 2 — InfrastructureTrustStrip
 * ──────────────────────────────────────────────────────────────────────────── */

interface InfraBadge {
  icon: LucideIcon;
  code: string;
  title: string;
  detail: string;
}

const INFRA_BADGES: ReadonlyArray<InfraBadge> = [
  {
    icon: ShieldCheck,
    code: "STERILIZATION CLASS",
    title: "Class-B German Autoclave",
    detail: "EN 13060 vacuum cycle for hollow and wrapped instruments",
  },
  {
    icon: Wind,
    code: "AIR CLASS",
    title: "ISO-5 HEPA Cleanroom",
    detail: "ISO 14644-1 Class 5 · ≤3,520 particles/m³ at ≥0.5µm",
  },
  {
    icon: Landmark,
    code: "0% EMI PARTNER NETWORK",
    title: "4 partner banks · 0% EMI",
    detail: EMI_BANKS,
  },
  {
    icon: BadgeCheck,
    code: "PATIENT RECORD",
    title: `${CLINIC.googleReviews}+ Google Reviews`,
    detail: "Outcomes tagged by procedure below",
  },
];

function InfrastructureTrustStrip() {
  return (
    <section
      aria-label="Sterilization class and 0% EMI partner network"
      className="border-y border-slate-200 bg-white"
    >
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {INFRA_BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <motion.li
              key={badge.code}
              initial="rest"
              whileHover="hover"
              whileTap="hover"
              className="bg-white px-5 py-6 sm:px-8"
            >
              <div className="flex items-start gap-4">
                <motion.span
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.14 } }}
                  transition={MASTER_SPRING}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-cyan-700 will-change-transform"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </motion.span>
                <div className={MONO}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {badge.code}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-950">
                    {badge.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {badge.detail}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Stage 3 — AsymmetricBentoGrid
 * ──────────────────────────────────────────────────────────────────────────── */

function ImplantSchematic() {
  return (
    <svg
      viewBox="0 0 220 250"
      role="img"
      aria-label="Cross-section schematic: implant fixture in bone with a 0.1mm nerve-safe margin above the nerve canal"
      className="mx-auto h-auto w-full max-w-[240px]"
    >
      {/* bone */}
      <rect
        x="10"
        y="108"
        width="200"
        height="132"
        rx="6"
        className="fill-slate-100 stroke-slate-300"
      />
      <line
        x1="10"
        y1="108"
        x2="210"
        y2="108"
        strokeDasharray="2 3"
        className="stroke-slate-400"
      />
      {/* crown */}
      <path
        d="M78 34 Q110 20 142 34 L146 78 Q110 88 74 78 Z"
        strokeWidth="1.5"
        className="fill-white stroke-cyan-700"
      />
      {/* abutment */}
      <path
        d="M92 80 L128 80 L122 108 L98 108 Z"
        className="fill-slate-200 stroke-slate-500"
      />
      {/* fixture + threads */}
      <rect
        x="98"
        y="108"
        width="24"
        height="86"
        rx="4"
        className="fill-slate-50 stroke-slate-700"
      />
      {Array.from({ length: 8 }, (_, index) => (
        <line
          key={index}
          x1="95"
          x2="125"
          y1={118 + index * 9.5}
          y2={118 + index * 9.5}
          strokeWidth="1.2"
          className="stroke-slate-500"
        />
      ))}
      {/* nerve canal */}
      <rect
        x="10"
        y="214"
        width="200"
        height="18"
        rx="9"
        strokeDasharray="4 4"
        className="fill-none stroke-cyan-600"
      />
      <text
        x="20"
        y="226"
        fontSize="9"
        className="fill-cyan-700 font-[family-name:var(--font-adg-mono)]"
      >
        NERVE CANAL
      </text>
      {/* dimension callout */}
      <line
        x1="122"
        y1="194"
        x2="150"
        y2="194"
        strokeDasharray="2 2"
        className="stroke-slate-400"
      />
      <line x1="150" y1="194" x2="150" y2="214" className="stroke-cyan-700" />
      <line x1="145" y1="194" x2="155" y2="194" className="stroke-cyan-700" />
      <line x1="145" y1="214" x2="155" y2="214" className="stroke-cyan-700" />
      <text
        x="160"
        y="208"
        fontSize="10"
        className="fill-cyan-700 font-[family-name:var(--font-adg-mono)]"
      >
        0.1mm
      </text>
      <text
        x="152"
        y="56"
        fontSize="9"
        className="fill-slate-500 font-[family-name:var(--font-adg-mono)]"
      >
        ZIRCONIA
      </text>
      <text
        x="132"
        y="156"
        fontSize="9"
        className="fill-slate-500 font-[family-name:var(--font-adg-mono)]"
      >
        TITANIUM
      </text>
    </svg>
  );
}

function SpecRow({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-medium ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function AsymmetricBentoGrid() {
  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p
            className={`text-[11px] uppercase tracking-[0.18em] text-cyan-700 ${MONO}`}
          >
            [ Implant systems ]
          </p>
          <h2
            id="systems-heading"
            className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Two systems. One placement protocol.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Straumann® SLActive® from Switzerland, Osstem® TS-Series from South
            Korea. Both are placed through the same 3D CBCT-planned surgical
            guide.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {/* Card 1 — Straumann (2 cols × 2 rows) */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <motion.article
              {...LIFT}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-slate-950 p-7 text-white will-change-transform sm:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
              />
              <HoverRing dark />
              <div className="relative">
                <p
                  className={`text-[11px] uppercase tracking-[0.16em] text-cyan-400 ${MONO}`}
                >
                  Tier 01 · Swiss system
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Straumann® SLActive®
                </h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">
                  Titanium fixture with a hydrophilic SLActive® surface, placed
                  through a printed 3D CBCT guide. Specified for compromised
                  bone quality and early-loading plans.
                </p>
                <dl
                  className={`mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4 ${MONO}`}
                >
                  <SpecRow dark label="Origin" value="Switzerland" />
                  <SpecRow dark label="Surface" value="SLActive®" />
                  <SpecRow dark label="Placement" value="3D CBCT guide" />
                  <SpecRow dark label="Crown" value="Zirconia" />
                </dl>
              </div>

              <div className="relative mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div className={MONO}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    From · per site
                  </p>
                  <p className="mt-1 text-4xl font-medium tracking-tight">
                    {money(PRICING.straumannSingle)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">
                    0% EMI · 12 × {formatBDT(PRICING.straumannSingle / 12)}
                  </p>
                </div>
                <CtaLink href={WA.straumann} variant="emeraldOnDark">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Request Straumann® quote
                </CtaLink>
              </div>
            </motion.article>
          </Reveal>

          {/* Card 2 — Osstem (1 col) */}
          <Reveal delay={0.06}>
            <motion.article
              {...LIFT}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm will-change-transform"
            >
              <HoverRing />
              <div>
                <p
                  className={`text-[11px] uppercase tracking-[0.16em] text-cyan-700 ${MONO}`}
                >
                  Tier 02 · Korean system
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  Osstem® TS-Series
                </h3>
                <dl className={`mt-5 grid grid-cols-2 gap-4 ${MONO}`}>
                  <SpecRow label="Origin" value="South Korea" />
                  <SpecRow label="Surface" value="Sand-blasted, acid-etched" />
                </dl>
              </div>
              <div className={`mt-8 border-t border-slate-200 pt-5 ${MONO}`}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  From · per site
                </p>
                <p className="mt-1 text-3xl font-medium tracking-tight text-slate-950">
                  {formatBDT(PRICING.osstemSingle)}
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  0% EMI · 12 × {formatBDT(PRICING.osstemSingle / 12)}
                </p>
                <CtaLink
                  href={WA.osstem}
                  variant="ink"
                  className="mt-5 w-full"
                >
                  Request Osstem® quote
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </CtaLink>
              </div>
            </motion.article>
          </Reveal>

          {/* Card 3 — CBCT planning layer (1 col) */}
          <Reveal delay={0.12}>
            <motion.article
              {...LIFT}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm will-change-transform"
            >
              <HoverRing />
              <div className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-cyan-700" aria-hidden />
                <p
                  className={`text-[11px] uppercase tracking-[0.16em] text-cyan-700 ${MONO}`}
                >
                  Planning layer
                </p>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                3D CBCT surgical guide
              </h3>
              <div className="my-5 flex flex-1 items-center">
                <ImplantSchematic />
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                The drill path is mapped against the nerve canal on the scan
                before the first incision. The guide is printed from that plan.
              </p>
            </motion.article>
          </Reveal>

          {/* Card 4 — Zirconia restoration (3 cols) */}
          <Reveal className="md:col-span-3" delay={0.06}>
            <motion.article
              {...LIFT}
              className="group relative grid h-full gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm will-change-transform sm:p-10 lg:grid-cols-12 lg:items-center"
            >
              <HoverRing />
              <div className="lg:col-span-5">
                <p
                  className={`text-[11px] uppercase tracking-[0.16em] text-cyan-700 ${MONO}`}
                >
                  Tier 03 · Restoration
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Zirconia crowns
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
                  Shade matched to the neighbouring teeth, bite alignment
                  checked at placement. Fitted over Straumann® or Osstem®
                  implants, or onto natural teeth.
                </p>
              </div>
              <dl
                className={`grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-4 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 ${MONO}`}
              >
                <SpecRow label="Crown from" value={formatBDT(PRICING.zirconiaCrown)} />
                <SpecRow label="Material" value="Zirconia" />
                <SpecRow label="Shade" value="Matched" />
                <SpecRow
                  label="Single-site range"
                  value={`${formatBDT(PRICING.osstemSingle)} – ${formatLakhCrore(PRICING.singleSiteCeiling)}`}
                />
              </dl>
            </motion.article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Stage 3 — PrincipalAuthorityRoster
 * ──────────────────────────────────────────────────────────────────────────── */

function PrincipalAuthorityRoster() {
  const status = useChamberStatus();

  return (
    <section
      id="roster"
      aria-labelledby="roster-heading"
      className="scroll-mt-20 bg-slate-950 py-16 text-white sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p
            className={`text-[11px] uppercase tracking-[0.18em] text-cyan-400 ${MONO}`}
          >
            [ Principal authority roster ]
          </p>
          <h2
            id="roster-heading"
            className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Case volume, not claims.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
            Career procedure volume and Google review count, shown as figures.
            Chamber hours run on Dhaka time (UTC+6).
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <motion.div
            {...LIFT_SOFT}
            className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p
                  className={`text-[10px] uppercase tracking-[0.16em] text-slate-400 ${MONO}`}
                >
                  Principal surgeon
                </p>
                <p className="mt-1.5 text-xl font-semibold tracking-tight">
                  {CLINIC.name}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {CLINIC.address}
                </p>
              </div>

              <div aria-live="polite" className="min-h-8">
                {status ? (
                  <span
                    className={`inline-flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] ${MONO} ${
                      status.isOpen ? "text-emerald-300" : "text-slate-300"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      {status.isOpen && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                      )}
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          status.isOpen ? "bg-emerald-500" : "bg-slate-500"
                        }`}
                      />
                    </span>
                    {status.label}
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="inline-block h-8 w-44 rounded-md bg-white/5"
                  />
                )}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              <div className="bg-slate-950 p-5">
                <dt
                  className={`text-[10px] uppercase tracking-[0.16em] text-slate-400 ${MONO}`}
                >
                  Career procedures
                </dt>
                <dd className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
                  <CountUp to={CLINIC.careerProcedures} suffix="+" />
                </dd>
              </div>
              <div className="bg-slate-950 p-5">
                <dt
                  className={`text-[10px] uppercase tracking-[0.16em] text-slate-400 ${MONO}`}
                >
                  Google reviews
                </dt>
                <dd className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
                  <CountUp to={CLINIC.googleReviews} suffix="+" />
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <p
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-400 ${MONO}`}
              >
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Operating hours · Sat–Thu
              </p>
              <ul className={`mt-3 divide-y divide-white/10 text-sm ${MONO}`}>
                {WEEK.map((day) => {
                  const closed = day.key === "Fri";
                  const isToday = status?.today === day.key;
                  return (
                    <li
                      key={day.key}
                      className={`flex items-center justify-between py-2.5 ${
                        isToday ? "text-white" : "text-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full ${
                            isToday ? "bg-cyan-400" : "bg-transparent"
                          }`}
                        />
                        {day.label}
                      </span>
                      <span>
                        {closed
                          ? "Closed"
                          : `${CLINIC.openLabel} – ${CLINIC.closeLabel}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Stage 3 — Verified Patient Outcomes
 * ──────────────────────────────────────────────────────────────────────────── */

const OUTCOMES = [
  {
    tag: "SURGICAL EXTRACTION",
    quote:
      "Flawless procedure. Zero post-op swelling and absolute precision during the extraction.",
  },
  {
    tag: "ROOT CANAL THERAPY",
    quote:
      "Completed the RCT in a single sitting with high-end sterilization protocols. Highly recommended for Mirpur residents.",
  },
  {
    tag: "AESTHETIC CROWN",
    quote:
      "The zirconia crown placement was seamless. Perfect bite alignment and color match.",
  },
] as const;

function VerifiedOutcomes() {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="scroll-mt-20 bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className={`text-[11px] uppercase tracking-[0.18em] text-cyan-700 ${MONO}`}
              >
                [ Verified patient outcomes ]
              </p>
              <h2
                id="outcomes-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
              >
                Patient outcomes, verified.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                Excerpts from {CLINIC.googleReviews}+ Google Reviews, tagged by
                procedure.
              </p>
            </div>
            <p
              className={`text-5xl font-medium tracking-tight text-slate-950 ${MONO}`}
            >
              <CountUp to={CLINIC.googleReviews} suffix="+" />
              <span className="mt-1 block text-[10px] font-normal uppercase tracking-[0.16em] text-slate-500">
                Google reviews on record
              </span>
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {OUTCOMES.map((outcome, index) => (
            <li key={outcome.tag}>
              <Reveal delay={index * 0.07}>
                <motion.figure
                  {...LIFT}
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 will-change-transform sm:p-7"
                >
                  <HoverRing />
                  <figcaption
                    className={`text-[11px] uppercase leading-relaxed tracking-[0.12em] text-cyan-700 ${MONO}`}
                  >
                    {`[ VERIFIED OUTCOME: ${outcome.tag} ]`}
                  </figcaption>
                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-slate-800">
                    {`“${outcome.quote}”`}
                  </blockquote>
                  <p
                    className={`mt-6 border-t border-slate-200 pt-4 text-[10px] uppercase tracking-[0.16em] text-slate-500 ${MONO}`}
                  >
                    Source · Google Reviews
                  </p>
                </motion.figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Locked vault preview banner (full triage + calculator ship later)
 * ──────────────────────────────────────────────────────────────────────────── */

const VAULT_FIELDS = [
  { label: "Treatment", value: "Single-site implant" },
  { label: "System tier", value: "Osstem® TS · Straumann® SLActive®" },
  { label: "EMI tenure", value: "3 · 6 · 12 months" },
] as const;

function VaultPreviewBanner() {
  return (
    <section
      id="vault"
      aria-labelledby="vault-heading"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p
                  className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cyan-700 ${MONO}`}
                >
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  [ Triage vault · locked preview ]
                </p>
                <h2
                  id="vault-heading"
                  className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                >
                  EMI estimate. Priority slot.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
                  Estimates by treatment, system tier and EMI tenure. The clinic
                  issues each one on WhatsApp together with the earliest
                  consultation slot.
                </p>
                <p className={`mt-5 text-sm text-slate-700 ${MONO}`}>
                  Single-site quotes: {formatBDT(PRICING.osstemSingle)} to{" "}
                  {formatLakhCrore(PRICING.singleSiteCeiling)}
                </p>
                <CtaLink
                  href={WA.vault}
                  variant="emerald"
                  className="mt-7 w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Lock 0% EMI Estimate &amp; Priority Slot via WhatsApp
                </CtaLink>
              </div>

              <div className="relative lg:col-span-6">
                <div
                  aria-hidden
                  className="pointer-events-none select-none rounded-2xl border border-slate-200 bg-slate-50 p-5 opacity-70"
                >
                  <ul className="divide-y divide-slate-200">
                    {VAULT_FIELDS.map((field) => (
                      <li
                        key={field.label}
                        className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span
                          className={`text-[10px] uppercase tracking-[0.16em] text-slate-500 ${MONO}`}
                        >
                          {field.label}
                        </span>
                        <span
                          className={`rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ${MONO}`}
                        >
                          {field.value}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between py-4">
                      <span
                        className={`text-[10px] uppercase tracking-[0.16em] text-slate-500 ${MONO}`}
                      >
                        Estimate
                      </span>
                      <span
                        className={`text-3xl font-medium tracking-tight text-slate-950 ${MONO}`}
                      >
                        ৳ ••,•••
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/40 backdrop-blur-[1.5px]">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white ${MONO}`}
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Issued via WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Footer & mobile sticky bar
 * ──────────────────────────────────────────────────────────────────────────── */

function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-5 pb-32 pt-14 text-slate-300 sm:px-8 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            {CLINIC.name}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {CLINIC.address}
          </p>
        </div>
        <div className={`text-sm ${MONO}`}>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Chamber hours
          </p>
          <p className="mt-2 text-white">
            Sat–Thu · {CLINIC.openLabel} – {CLINIC.closeLabel}
          </p>
          <p className="mt-1 text-slate-500">Friday closed</p>
        </div>
        <div className={`text-sm ${MONO}`}>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            WhatsApp priority line
          </p>
          <a
            href={WA.book}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-flex min-h-12 items-center text-white underline decoration-slate-600 underline-offset-4 hover:decoration-cyan-400 ${FOCUS}`}
          >
            {CLINIC.whatsappDisplay}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
        <p>
          Prices are starting values. Final quotes follow clinical examination
          and a 3D CBCT scan. EMI subject to partner bank card approval.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} {CLINIC.name}. {CLINIC.zone}, Dhaka.
        </p>
      </div>
    </footer>
  );
}

function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <div className={`min-w-0 shrink-0 ${MONO}`}>
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
            From · 0% EMI
          </p>
          <p className="text-base font-semibold text-slate-950">
            {formatBDT(PRICING.osstemSingle)}
          </p>
        </div>
        <CtaLink href={WA.priority} variant="emerald" className="flex-1">
          <MessageCircle className="h-4 w-4" aria-hidden />
          Priority WhatsApp
        </CtaLink>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────────── */

export default function AlinasDentalGracePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${sans.variable} ${mono.variable} relative overflow-x-clip bg-slate-50 font-[family-name:var(--font-adg-sans)] text-slate-900 antialiased`}
      >
        <SiteHeader />
        <main>
          <HeroAuthorityAnchor />
          <InfrastructureTrustStrip />
          <AsymmetricBentoGrid />
          <PrincipalAuthorityRoster />
          <VerifiedOutcomes />
          <VaultPreviewBanner />
        </main>
        <SiteFooter />
        <MobileStickyBar />
      </div>
    </MotionConfig>
  );
}

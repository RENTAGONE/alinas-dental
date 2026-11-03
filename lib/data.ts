import { bi, type Bi } from "./i18n";
import { slotsFrom, type Slot } from "./dhaka";
import { CLINIC } from "@/src/config/clinic";

export type Art = "tooth" | "smile" | "scan" | "skin" | "team" | "clinic";

/** {{...}} in any Bi string renders in font-mono tabular-nums (see Rich in components/ui.tsx). */
export interface Treatment {
  slug: string; name: Bi; tab: Bi; short: Bi; from: number; to: number;
  unit: Bi; duration: Bi; benefits: Bi[]; art: Art; image: string;
}
export interface Tier { id: "standard" | "premium" | "advanced"; name: Bi; lo: number; hi: number }
export interface Doctor { slug: string; name: Bi; role: Bi; years: number; credentials: Bi[]; image: string }
export interface Review { id: string; kind: "theme" | "quote"; text: Bi; treatment?: string; author?: string }

const perTooth = bi("প্রতি দাঁত", "per tooth");

/** Price ranges are the clinic's listed ranges (৳ low to high). Slugs feed /api/lead: rename here and update HIGH_TICKET in app/api/lead/route.ts. */
export const TREATMENTS: Treatment[] = [
  {
    slug: "implants", art: "tooth", image: "/images/treatments/implants.jpg",
    name: bi("ডেন্টাল ইমপ্ল্যান্ট ও ক্রাউন", "Dental Implants & Crown"), tab: bi("ইমপ্ল্যান্ট", "Implants"),
    short: bi("হারানো দাঁতের জায়গায় ইমপ্ল্যান্ট ও ক্রাউন, প্রতি দাঁতের হিসাবে।", "An implant and crown to replace a missing tooth, priced per tooth."),
    from: 45000, to: 120000, unit: perTooth, duration: bi("{{2–3}} ভিজিট", "{{2–3}} visits"),
    benefits: [
      bi("ইমপ্ল্যান্ট ও ক্রাউন একই প্রতি-দাঁত পরিসরে", "Implant and crown share one per-tooth range"),
      bi("মোট {{2–3}} ভিজিট", "{{2–3}} visits in total"),
      bi("পরীক্ষার পর পরিকল্পনা ও চূড়ান্ত খরচ নির্ধারণ", "Plan and final cost set after examination"),
    ],
  },
  {
    slug: "rct-crown", art: "scan", image: "/images/treatments/rct-crown.jpg",
    name: bi("সিঙ্গেল-সিটিং রুট ক্যানেল ও জিরকোনিয়া ক্রাউন", "Single-Sitting Root Canal & Zirconia Crown"), tab: bi("রুট ক্যানেল", "Root canal"),
    short: bi("দাঁতের অবস্থা অনুযায়ী এক সিটিংয়ে রুট ক্যানেল, তারপর জিরকোনিয়া ক্রাউন।", "Root canal in a single sitting where the tooth allows, finished with a zirconia crown."),
    from: 8000, to: 22000, unit: perTooth, duration: bi("{{1–2}} ভিজিট", "{{1–2}} visits"),
    benefits: [
      bi("দাঁতের অবস্থা অনুযায়ী এক সিটিংয়ে রুট ক্যানেল", "Root canal in one sitting where the tooth allows"),
      bi("দাঁত সম্পূর্ণ করতে জিরকোনিয়া ক্রাউন", "A zirconia crown to finish the tooth"),
      bi("মোট {{1–2}} ভিজিট", "{{1–2}} visits in total"),
    ],
  },
  {
    slug: "orthodontics", art: "smile", image: "/images/treatments/orthodontics.jpg",
    name: bi("ব্রেসেস ও ক্লিয়ার অর্থোডন্টিক অ্যালাইনার", "Braces & Clear Orthodontic Aligners"), tab: bi("ব্রেসেস ও অ্যালাইনার", "Braces & aligners"),
    short: bi("দাঁত সোজা করার জন্য ব্রেসেস ও ক্লিয়ার অ্যালাইনার, পূর্ণ কেস হিসাবে পরিকল্পিত।", "Braces and clear aligners to straighten teeth, planned as one full case."),
    from: 35000, to: 95000, unit: bi("পূর্ণ কেস", "full case"), duration: bi("কেস অনুযায়ী", "Case dependent"),
    benefits: [
      bi("ব্রেসেস ও ক্লিয়ার অ্যালাইনার, দুটি বিকল্প", "Braces and clear aligners, two options"),
      bi("পূর্ণ কেসের জন্য একটি মূল্য পরিসর", "One price range per full case"),
      bi("সময়কাল কেস অনুযায়ী", "Duration depends on the case"),
    ],
  },
  {
    slug: "veneers", art: "smile", image: "/images/treatments/veneers.jpg",
    name: bi("জিরকোনিয়া ভিনিয়ার ও স্মাইল ডিজাইন", "Aesthetic Zirconia Veneers & Smile Design"), tab: bi("ভিনিয়ার", "Veneers"),
    short: bi("স্মাইল ডিজাইন অনুযায়ী জিরকোনিয়া ভিনিয়ার, {{2}} ভিজিটে।", "Zirconia veneers shaped to your smile design, in {{2}} visits."),
    from: 10000, to: 18000, unit: perTooth, duration: bi("{{2}} ভিজিট", "{{2}} visits"),
    benefits: [
      bi("জিরকোনিয়া ভিনিয়ার", "Zirconia veneers"),
      bi("ভিনিয়ারের সঙ্গে স্মাইল ডিজাইনের পরিকল্পনা", "Smile design planned with the veneers"),
      bi("{{2}} ভিজিট, প্রতি দাঁতের হিসাবে", "{{2}} visits, priced per tooth"),
    ],
  },
  {
    slug: "extraction", art: "clinic", image: "/images/treatments/extraction.jpg",
    name: bi("সার্জিক্যাল আক্কেল দাঁত অপসারণ", "Surgical Wisdom Tooth Extraction"), tab: bi("আক্কেল দাঁত", "Wisdom tooth"),
    short: bi("আক্কেল দাঁতের সার্জিক্যাল অপসারণ, প্রতি দাঁতের হিসাবে।", "Surgical removal of wisdom teeth, priced per tooth."),
    from: 4500, to: 15000, unit: perTooth, duration: bi("{{1}} ভিজিট", "{{1}} visit"),
    benefits: [
      bi("সার্জিক্যাল পদ্ধতিতে আক্কেল দাঁত অপসারণ", "Surgical removal of wisdom teeth"),
      bi("{{1}} ভিজিট", "{{1}} visit"),
      bi("Google রিভিউতে ব্যথাহীন অপসারণ ও ফোলা না হওয়ার কথা এসেছে", "Google reviews mention painless removal and no swelling"),
    ],
  },
  {
    slug: "whitening", art: "smile", image: "/images/treatments/whitening.jpg",
    name: bi("আল্ট্রাসনিক স্কেলিং, পলিশিং ও লেজার হোয়াইটেনিং", "Ultrasonic Scaling, Polishing & Laser Whitening"), tab: bi("স্কেলিং ও হোয়াইটেনিং", "Scaling & whitening"),
    short: bi("আল্ট্রাসনিক স্কেলিং ও পলিশিং, সঙ্গে লেজার হোয়াইটেনিং; প্রতি সেশনের হিসাবে।", "Ultrasonic scaling and polishing with laser whitening, priced per session."),
    from: 2000, to: 9500, unit: bi("প্রতি সেশন", "per session"), duration: bi("{{1}} ভিজিট", "{{1}} visit"),
    benefits: [
      bi("আল্ট্রাসনিক স্কেলিং ও পলিশিং", "Ultrasonic scaling and polishing"),
      bi("লেজার হোয়াইটেনিং", "Laser whitening"),
      bi("{{1}} ভিজিট, প্রতি সেশনের হিসাবে", "{{1}} visit, priced per session"),
    ],
  },
];

/**
 * Tiers split the clinic's listed range into three bands, so every figure shown stays inside the range the clinic gave.
 * Change `lo` / `hi` (0 to 1) to move the band edges.
 */
export const TIERS: Tier[] = [
  { id: "standard", name: bi("স্ট্যান্ডার্ড", "Standard"), lo: 0, hi: 0.35 },
  { id: "premium", name: bi("প্রিমিয়াম", "Premium"), lo: 0.35, hi: 0.7 },
  { id: "advanced", name: bi("অ্যাডভান্সড", "Advanced"), lo: 0.7, hi: 1 },
];

export const tierRange = (t: Treatment, tier: Tier): { from: number; to: number } => {
  const span = t.to - t.from;
  const snap = (n: number): number => Math.round(n / 500) * 500;
  return {
    from: tier.lo === 0 ? t.from : snap(t.from + span * tier.lo),
    to: tier.hi === 1 ? t.to : snap(t.from + span * tier.hi),
  };
};

/** Request windows: 90-minute blocks across the chamber hours. With no schedule, three broad windows are used. */
const FALLBACK_SLOTS: Slot[] = [
  { id: "09:00-12:00", from: "09:00", to: "12:00" },
  { id: "12:00-17:00", from: "12:00", to: "17:00" },
  { id: "17:00-21:00", from: "17:00", to: "21:00" },
];
const built = slotsFrom(CLINIC.schedule);
export const SLOTS: Slot[] = built.length > 0 ? built : FALLBACK_SLOTS;

export const SPECIALTIES: Bi[] = [
  bi("ডেন্টাল ইমপ্ল্যান্ট", "Dental implants"),
  bi("রুট ক্যানেল", "Root canal"),
  bi("অর্থোডন্টিক্স", "Orthodontics"),
  bi("অ্যাসথেটিক ডেন্টিস্ট্রি", "Aesthetic dentistry"),
];

/** Years stays 0 until the clinic confirms it (0 hides the line). To list people, replace this entry with one per dentist and add their portrait. */
export const DOCTORS: Doctor[] = [
  {
    slug: "chief-consultant", image: "/images/doctors/chief-consultant.jpg",
    name: bi("চীফ কনসালট্যান্ট ডেন্টাল সার্জন", "Chief Consultant Dental Surgeon"),
    role: bi("অ্যালিনাস ডেন্টাল গ্রেস ক্লিনিক্যাল টিম", "Alina’s Dental Grace Clinical Team"),
    years: 0, credentials: [],
  },
];

/**
 * Google review themes the client confirmed, paraphrased. kind "theme" = paraphrase (shown with a label).
 * To show a real quote, add { kind: "quote", author: "Name", text } with the exact review text.
 */
export const REVIEWS: Review[] = [
  { id: "extraction", kind: "theme", treatment: "extraction", text: bi("রোগীরা আক্কেল দাঁতের সার্জিক্যাল অপসারণকে ব্যথাহীন বলেছেন; পরে কোনো ফোলা ছিল না।", "Patients describe surgical wisdom tooth extraction as painless, with no swelling afterwards.") },
  { id: "rct", kind: "theme", treatment: "rct-crown", text: bi("রোগীরা কঠোর স্টেরিলাইজেশনের সঙ্গে এক সিটিংয়ে রুট ক্যানেল হওয়ার কথা উল্লেখ করেছেন।", "Patients mention single-sitting root canal treatment carried out with strict sterilization.") },
  { id: "crown", kind: "theme", treatment: "rct-crown", text: bi("রোগীরা মিরপুর-৬-এ দাঁতের রঙের সঙ্গে মেলানো প্রাকৃতিক দেখতে ক্রাউনের কথা বলেছেন।", "Patients mention natural-looking crowns with the shade matched to their teeth, in Mirpur-6.") },
];

export const FAQS: { q: Bi; a: Bi }[] = [
  {
    q: bi("কীভাবে স্লটের অনুরোধ করব?", "How do I request a slot?"),
    a: bi(`এই পেজে ট্রিটমেন্ট, সময়সীমা ও সময় বেছে নিন, অথবা WhatsApp-এ লিখুন বা {{${CLINIC.phoneLabel}}} নম্বরে ফোন করুন। ক্লিনিক আপনাকে সময় নিশ্চিত করবে।`, `Pick a treatment, window and time on this page, message on WhatsApp, or call {{${CLINIC.phoneLabel}}}. The clinic confirms a time with you.`),
  },
  {
    q: bi("ক্লিনিক কোথায়?", "Where is the clinic?"),
    a: bi("এভিনিউ-৫/১৭, মিরপুর-৬, ঢাকা ১২১৬।", "Avenue-5/17, Mirpur-6, Dhaka 1216."),
  },
  {
    q: bi("চেম্বার কখন খোলা?", "When is the chamber open?"),
    a: bi("শনি থেকে বৃহস্পতিবার, বিকাল {{5:00}} থেকে রাত {{10:30}}। শুক্রবার বন্ধ।", "Saturday to Thursday, {{5:00 PM – 10:30 PM}}. Friday is closed."),
  },
  {
    q: bi("প্রথম ভিজিটে কী হয়?", "What happens at the first visit?"),
    a: bi("ডেন্টাল সার্জন আপনার সমস্যা শুনে দাঁত পরীক্ষা করবেন এবং চিকিৎসার বিকল্প ও আনুমানিক খরচ বুঝিয়ে বলবেন।", "The dental surgeon listens, examines your teeth and explains your options and the likely cost."),
  },
  {
    q: bi("ওয়েবসাইটের দাম কি চূড়ান্ত?", "Are the prices on this site final?"),
    a: bi("না। এগুলো ক্লিনিকের তালিকাভুক্ত পরিসর। পরীক্ষার পর চূড়ান্ত খরচ নিশ্চিত হয়।", "No. They are the clinic’s listed ranges. The final cost is confirmed after examination."),
  },
  {
    q: bi("কোন চিকিৎসায় কত ভিজিট লাগে?", "How many visits does each treatment take?"),
    a: bi("ইমপ্ল্যান্ট {{2–3}}, রুট ক্যানেল ও জিরকোনিয়া ক্রাউন {{1–2}}, ভিনিয়ার {{2}}; আক্কেল দাঁত, স্কেলিং ও হোয়াইটেনিং {{1}}। ব্রেসেস কেস অনুযায়ী।", "Implants {{2–3}}, root canal with zirconia crown {{1–2}}, veneers {{2}}; wisdom tooth extraction, scaling and whitening {{1}}. Braces depend on the case."),
  },
];

/** Counters read the clinic's own figures, so they cannot drift from the rest of the site. */
export const STATS = [
  { to: CLINIC.rating.value, suffix: "★", decimals: 1, label: bi("Google রেটিং", "Google rating") },
  { to: CLINIC.rating.count, suffix: "+", decimals: 0, label: bi("Google রিভিউ", "Google reviews") },
  { to: TREATMENTS.length, suffix: "", decimals: 0, label: bi("মূল ক্লিনিক্যাল বিভাগ", "core clinical specialties") },
  { to: CLINIC.schedule ? CLINIC.schedule.openDays.length : 0, suffix: "", decimals: 0, label: bi("সপ্তাহে চেম্বারের দিন", "chamber days a week") },
].filter((s) => s.to > 0);

export const PROCESS = [
  { t: bi("বার্তা বা ফোন", "Message or call"), d: bi("WhatsApp বা ফোনে আপনার সমস্যা জানান। ক্লিনিক চেম্বারের সময় নিশ্চিত করবে।", "Tell the clinic what is bothering you on WhatsApp or by phone. The clinic confirms a chamber time.") },
  { t: bi("চেম্বারে পরীক্ষা", "Chamber examination"), d: bi("ডেন্টাল সার্জন আপনার দাঁত পরীক্ষা করে কী দরকার তা বুঝিয়ে বলবেন।", "The dental surgeon examines your teeth and explains what is needed.") },
  { t: bi("চিকিৎসা পরিকল্পনা", "Treatment plan"), d: bi("বিকল্প ও আনুমানিক খরচ সামনে রেখে আপনি সিদ্ধান্ত নেবেন।", "You decide with the options and the likely cost in front of you.") },
  { t: bi("চিকিৎসা ও ফলো-আপ", "Treatment and follow-up"), d: bi("পরিকল্পনা অনুযায়ী চিকিৎসা, প্রয়োজনে ফলো-আপ ভিজিট।", "Treatment as planned, with follow-up visits where needed.") },
];

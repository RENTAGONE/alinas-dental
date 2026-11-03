import { bi, type Bi } from "@/lib/i18n";
import type { Schedule } from "@/lib/dhaka";

/** Edit here: the whole site (nav, footer, WhatsApp links, JSON-LD, map, live chamber status) reads from this file. */
export const CLINIC = {
  name: "Alina’s Dental Grace",
  nameBn: "অ্যালিনাস ডেন্টাল গ্রেস",
  whatsapp: "8801533835136",
  phone: "+8801533835136",
  phoneLabel: "+880 1533-835136",
  address: bi("এভিনিউ-৫/১৭, মিরপুর-৬, ঢাকা ১২১৬", "Avenue-5/17, Mirpur-6, Dhaka 1216"),
  zone: bi("মিরপুর-৬, ঢাকা", "Mirpur-6, Dhaka"),
  /** Paste the clinic's Google Maps share link here. Empty = a Google Maps search link is built from the name and address. */
  mapsUrl: "",
  rating: { value: 4.9, count: 161 },
  facebook: "",
  instagram: "",
  /** Display text. {{...}} renders in monospace. Leave the array empty to hide hours and switch the live pill to the zone badge. */
  hours: [bi("শনি–বৃহস্পতি: বিকাল {{5:00}} – রাত {{10:30}} (শুক্রবার বন্ধ)", "Sat–Thu: {{5:00 PM – 10:30 PM}} (Friday closed)")] as Bi[],
  /** Machine-readable twin of `hours`, used for the live open/closed pill and the request windows. */
  schedule: { openDays: [6, 0, 1, 2, 3, 4], open: "17:00", close: "22:30" } as Schedule | null,
};

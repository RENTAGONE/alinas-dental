import { bi, type Bi, type Lang } from "./i18n";

export const WINDOWS = [
  { id: "soon", label: bi("আজ / আগামীকাল", "Today / Tomorrow"), hint: bi("আজ বা আগামীকালের চেম্বার স্লট, চেম্বার খোলা থাকলে", "A chamber slot today or tomorrow, if the chamber is open") },
  { id: "week", label: bi("{{7}} দিনের মধ্যে", "Within {{7}} days"), hint: bi("আগামী {{7}} দিনের যেকোনো চেম্বার দিন", "Any chamber day in the next {{7}} days") },
  { id: "general", label: bi("সাধারণ কনসালটেশন", "General consultation"), hint: bi("নির্দিষ্ট তারিখ নেই; ক্লিনিক সময় জানাবে", "No fixed date; the clinic suggests a time") },
] as const satisfies ReadonlyArray<{ id: string; label: Bi; hint: Bi }>;

export type WindowId = (typeof WINDOWS)[number]["id"];
export const WINDOW_IDS: readonly string[] = WINDOWS.map((w) => w.id);

/** Bangladesh mobile: 01[3-9]XXXXXXXX with optional +88 / 88 prefix. */
export const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
export const cleanPhone = (v: string): string => v.replace(/[\s-]/g, "");

/** What the AppointmentPicker posts to /api/lead. */
export interface LeadPayload {
  treatment: string;
  window: WindowId;
  slot: string;
  phone: string;
  lang: Lang;
  /** Honeypot: real visitors never see or fill this. */
  hp: string;
  /** Milliseconds between the picker opening and the dispatch tap (fill-time trap). */
  elapsed: number;
}

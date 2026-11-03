import { bi, type Bi } from "./i18n";

/** Chamber schedule in Asia/Dhaka (UTC+6). openDays: 0 = Sunday ... 6 = Saturday. open/close are 24h "HH:MM". */
export interface Schedule { openDays: number[]; open: string; close: string }
export interface ChamberStatus { open: boolean; time: string; dayIdx: number | null }
export interface Slot { id: string; from: string; to: string }

export const DAY_SHORT: Bi[] = [
  bi("রবি", "Sun"), bi("সোম", "Mon"), bi("মঙ্গল", "Tue"), bi("বুধ", "Wed"), bi("বৃহ", "Thu"), bi("শুক্র", "Fri"), bi("শনি", "Sat"),
];

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const hhmm = (min: number): string => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const t12 = (v: string): string => {
  const [h, m] = v.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

/** "5:00 – 6:30 PM", or "11:30 AM – 1:00 PM" when the window crosses noon. */
export const slotLabel = (from: string, to: string): string => {
  const [aT, aS] = t12(from).split(" ");
  const b = t12(to);
  const bS = b.split(" ")[1];
  return aS === bS ? `${aT} – ${b}` : `${aT} ${aS} – ${b}`;
};

/** Day of week and minutes since midnight, read on the Asia/Dhaka clock whatever the visitor's device timezone is. */
export function dhakaNow(now: Date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Dhaka", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? "";
  return { day: WEEKDAY[get("weekday")] ?? 0, minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
}

export function chamberStatus(s: Schedule, now: Date = new Date()): ChamberStatus {
  const { day, minutes } = dhakaNow(now);
  const o = toMin(s.open);
  const c = toMin(s.close);
  const today = s.openDays.includes(day);
  if (today && minutes >= o && minutes < c) return { open: true, time: t12(s.close), dayIdx: null };
  if (today && minutes < o) return { open: false, time: t12(s.open), dayIdx: null };
  for (let i = 1; i <= 7; i += 1) {
    const d = (day + i) % 7;
    if (s.openDays.includes(d)) return { open: false, time: t12(s.open), dayIdx: d };
  }
  return { open: false, time: t12(s.open), dayIdx: null };
}

/** 90-minute request windows between opening and closing time. */
export function slotsFrom(s: Schedule | null): Slot[] {
  if (!s) return [];
  const out: Slot[] = [];
  const end = toMin(s.close);
  for (let m = toMin(s.open); m < end; m += 90) {
    const to = Math.min(m + 90, end);
    out.push({ id: `${hhmm(m)}-${hhmm(to)}`, from: hhmm(m), to: hhmm(to) });
  }
  return out;
}

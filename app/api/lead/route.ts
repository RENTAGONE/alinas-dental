import { NextResponse } from "next/server";
import { SLOTS, TREATMENTS } from "@/lib/data";
import { slotLabel } from "@/lib/dhaka";
import { plain, takaRange } from "@/lib/i18n";
import { BD_MOBILE, WINDOWS, WINDOW_IDS, cleanPhone, type WindowId } from "@/lib/lead";

export const runtime = "nodejs";

/** Scoring uses treatment slugs. When slugs in lib/data.ts change, update these two arrays. */
const HIGH_TICKET: readonly string[] = ["implants", "orthodontics", "veneers"];
const MID_TICKET: readonly string[] = ["rct-crown", "extraction"];

/** The whitelist comes from lib/data.ts, so adding or renaming a treatment cannot break the form. */
const SLUGS = new Set(TREATMENTS.map((t) => t.slug));
const SLOT_IDS = new Set(SLOTS.map((s) => s.id));
for (const s of [...HIGH_TICKET, ...MID_TICKET]) {
  if (!SLUGS.has(s)) console.warn(`[lead] scoring slug "${s}" is not in lib/data.ts`);
}

const MAX_BODY = 4000;
const MIN_FILL_MS = 2000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const SPAM = /(https?:\/\/|www\.|\.com\b|casino|crypto|bitcoin|forex|loan|viagra|backlink|seo\s*(service|rank)|t\.me\/)/i;

/** Per-instance memory: stops casual hammering. On serverless it resets per instance, so treat it as a first filter, not a wall. */
const HITS = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 5000) {
    HITS.forEach((times, key) => {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) HITS.delete(key);
    });
  }
  return recent.length > RATE_MAX;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

function score(slug: string, w: WindowId, hasPhone: boolean): number {
  let s = HIGH_TICKET.includes(slug) ? 50 : MID_TICKET.includes(slug) ? 30 : 10;
  s += w === "soon" ? 30 : w === "week" ? 15 : 0;
  if (hasPhone) s += 20;
  return s;
}
const band = (s: number): string => (s >= 70 ? "HOT" : s >= 45 ? "WARM" : "COLD");

async function postJson(url: string, body: unknown): Promise<void> {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), 4000);
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal });
  } finally {
    clearTimeout(id);
  }
}

async function dispatch(text: string): Promise<void> {
  const tasks: Promise<void>[] = [];
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (token && chat) tasks.push(postJson(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chat, text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 1900) }));
  if (tasks.length === 0) console.log(`[lead]\n${text}`);
  await Promise.allSettled(tasks);
}

export async function POST(req: Request): Promise<NextResponse> {
  const quiet = NextResponse.json({ ok: true });
  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ ok: false, error: "bad_body" }, { status: 400 });

  // Honeypot and fill-time trap: bots get a normal-looking success and nothing is dispatched.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (str(body.hp, 100) !== "" || elapsed < MIN_FILL_MS) return quiet;

  const now = Date.now();
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip, now)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const slug = str(body.treatment, 40);
  const windowId = str(body.window, 20);
  const slot = str(body.slot, 20);
  const phoneRaw = str(body.phone, 24);
  const lang = body.lang === "en" ? "en" : "bn";

  if (SPAM.test(`${slug} ${windowId} ${slot} ${phoneRaw}`)) return quiet;
  if (!SLUGS.has(slug) || !WINDOW_IDS.includes(windowId) || !SLOT_IDS.has(slot)) {
    return NextResponse.json({ ok: false, error: "invalid_selection" }, { status: 400 });
  }
  const phone = cleanPhone(phoneRaw);
  if (phone !== "" && !BD_MOBILE.test(phone)) return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });

  const t = TREATMENTS.find((x) => x.slug === slug);
  const slotInfo = SLOTS.find((s) => s.id === slot);
  const win = WINDOWS.find((w) => w.id === windowId);
  if (!t || !slotInfo || !win) return NextResponse.json({ ok: false, error: "invalid_selection" }, { status: 400 });

  const pts = score(slug, win.id, phone !== "");
  const text = [
    `New lead: ${band(pts)} (${pts})`,
    `Treatment: ${t.name.en} (${slug})`,
    `Window: ${plain(win.label.en)}`,
    `Slot: ${slotLabel(slotInfo.from, slotInfo.to)}`,
    `Listed range: ${takaRange(t.from, t.to)} ${t.unit.en}`,
    `Phone: ${phone !== "" ? phone : "not given (WhatsApp message opened)"}`,
    `Site language: ${lang}`,
  ].join("\n");

  await dispatch(text);
  return quiet;
}

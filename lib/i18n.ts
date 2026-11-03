export type Lang = "bn" | "en";
export interface Bi { bn: string; en: string }
export const bi = (bn: string, en: string): Bi => ({ bn, en });

/** Every figure on the site uses Latin digits with South Asian grouping (1,20,000), set in font-mono tabular-nums. */
export const fmt = (n: number): string => Math.round(n).toLocaleString("en-IN");
export const taka = (n: number): string => `৳${fmt(n)}`;
export const takaRange = (from: number, to: number): string => `${taka(from)} – ${taka(to)}`;

/** Strip the {{mono}} markers, for text that goes into WhatsApp messages or API payloads. */
export const plain = (s: string): string => s.replace(/\{\{|\}\}/g, "");

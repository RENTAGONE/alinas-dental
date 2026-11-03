import type { MetadataRoute } from "next";
import { TREATMENTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const base = host ? `https://${host}` : "http://localhost:3000";
  const paths = ["", "/treatments", "/team", "/process", "/reviews", "/contact", ...TREATMENTS.map((t) => `/treatments/${t.slug}`)];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}

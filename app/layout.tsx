import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, JetBrains_Mono, Noto_Serif_Bengali, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { SITE } from "@/lib/site";

// F03: Playfair Display (display) + DM Sans (body) + Noto Serif Bengali (Bangla) + JetBrains Mono (every figure)
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const bn = Noto_Serif_Bengali({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--font-bn", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${SITE.name} | Dental Implants, Root Canal & Orthodontics, Mirpur-6 Dhaka`, template: `%s | ${SITE.name}` },
  description: "Dental implants, single-sitting root canal with zirconia crown, braces and clear aligners, veneers, wisdom tooth surgery and scaling at Avenue-5/17, Mirpur-6, Dhaka. Saturday to Thursday, 5:00 PM to 10:30 PM.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#062219", width: "device-width", initialScale: 1 };

const DAY_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const LD = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: SITE.name,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", streetAddress: SITE.address.en, addressLocality: "Dhaka", addressCountry: "BD" },
  sameAs: [SITE.facebook, SITE.instagram, SITE.mapsUrl].filter((u) => u !== ""),
  aggregateRating: { "@type": "AggregateRating", ratingValue: String(SITE.rating.value), reviewCount: String(SITE.rating.count) },
  ...(SITE.schedule
    ? { openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: SITE.schedule.openDays.map((d) => DAY_SCHEMA[d]), opens: SITE.schedule.open, closes: SITE.schedule.close }] }
    : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" className={`${display.variable} ${sans.variable} ${bn.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileBar />
        </Providers>
      </body>
    </html>
  );
}

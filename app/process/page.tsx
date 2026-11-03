import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { Process } from "@/components/Process";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { bi } from "@/lib/i18n";

export const metadata: Metadata = { title: "Treatment process" };

export default function ProcessPage() {
  return (
    <>
      <PageHero crumb={bi("চিকিৎসা প্রক্রিয়া", "Treatment process")} title={bi("বার্তা থেকে ফলো-আপ", "From message to follow-up")} sub={bi("চারটি ধাপ, এবং প্রতিটি ধাপে কী হয়।", "Four steps, and what happens at each one.")} />
      <Process tone="light" />
      <FAQ tone="dark" />
      <CTABand />
    </>
  );
}

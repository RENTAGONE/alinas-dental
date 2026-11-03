import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { Doctors } from "@/components/Doctors";
import { CTABand } from "@/components/CTABand";
import { bi } from "@/lib/i18n";

export const metadata: Metadata = { title: "Dental team" };

export default function TeamPage() {
  return (
    <>
      <PageHero crumb={bi("ডেন্টাল টিম", "Team")} title={bi("চীফ কনসালট্যান্ট ও ক্লিনিক্যাল টিম", "Chief consultant and clinical team")} sub={bi("এভিনিউ-৫/১৭, মিরপুর-৬-এর চেম্বারে।", "At the Avenue-5/17, Mirpur-6 chamber.")} />
      <Doctors withHead={false} tone="light" />
      <CTABand />
    </>
  );
}

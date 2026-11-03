import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { TreatmentCard } from "@/components/TreatmentCard";
import { CTABand } from "@/components/CTABand";
import { TREATMENTS } from "@/lib/data";
import { bi } from "@/lib/i18n";

export const metadata: Metadata = { title: "Treatments" };

export default function TreatmentsPage() {
  return (
    <>
      <PageHero crumb={bi("ট্রিটমেন্ট", "Treatments")} title={bi("ছয়টি ক্লিনিক্যাল বিভাগ", "Six clinical specialties")} sub={bi("প্রতিটি ট্রিটমেন্টের তালিকাভুক্ত খরচের পরিসর ও ভিজিটের সংখ্যা।", "The listed cost range and number of visits for each treatment.")} />
      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t, i) => <TreatmentCard key={t.slug} t={t} delay={(i % 3) * 0.08} />)}
        </div>
      </Section>
      <CTABand />
    </>
  );
}

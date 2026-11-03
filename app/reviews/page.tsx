import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { Reviews } from "@/components/Reviews";
import { CTABand } from "@/components/CTABand";
import { bi } from "@/lib/i18n";

export const metadata: Metadata = { title: "Google reviews" };

export default function ReviewsPage() {
  return (
    <>
      <PageHero crumb={bi("রিভিউ", "Reviews")} title={bi("Google-এ রোগীদের রেটিং", "Patient ratings on Google")} sub={bi("রেটিং, রিভিউয়ের সংখ্যা এবং রিভিউতে বারবার আসা বিষয়।", "The rating, the review count and what the reviews keep mentioning.")} />
      <Reviews />
      <CTABand />
    </>
  );
}

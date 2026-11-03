import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { AppointmentPicker } from "@/components/AppointmentPicker";
import { LocationSection } from "@/components/LocationSection";
import { bi } from "@/lib/i18n";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero crumb={bi("যোগাযোগ", "Contact")} title={bi("চেম্বার স্লট দেখুন", "Check chamber slot")} sub={bi("এভিনিউ-৫/১৭, মিরপুর-৬। WhatsApp-এ লিখুন বা ফোন করুন।", "Avenue-5/17, Mirpur-6. Message on WhatsApp or call.")} />
      <AppointmentPicker tone="mid" />
      <LocationSection tone="light" />
    </>
  );
}

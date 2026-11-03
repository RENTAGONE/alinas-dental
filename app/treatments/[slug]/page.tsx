import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TREATMENTS } from "@/lib/data";
import { plain } from "@/lib/i18n";
import { TreatmentDetail } from "@/components/TreatmentDetail";

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = TREATMENTS.find((x) => x.slug === params.slug);
  return t ? { title: t.name.en, description: plain(t.short.en) } : {};
}

export default function TreatmentPage({ params }: { params: { slug: string } }) {
  const t = TREATMENTS.find((x) => x.slug === params.slug);
  if (!t) notFound();
  return <TreatmentDetail t={t} />;
}

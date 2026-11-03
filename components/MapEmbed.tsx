import { SITE } from "@/lib/site";

export function MapEmbed({ className = "" }: { className?: string }) {
  const q = encodeURIComponent(`${SITE.name}, ${SITE.address.en}`);
  return (
    <div className={`overflow-hidden border border-ink-950/15 bg-ink-900 ${className}`}>
      <iframe title={`${SITE.name} on Google Maps`} src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[20rem] w-full border-0" />
    </div>
  );
}

import { CLINIC } from "@/src/config/clinic";

export const SITE = { ...CLINIC, email: "", consultFee: 0 };

export const MAPS_LINK: string = SITE.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${SITE.address.en}`)}`;

export const wa = (text: string): string => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

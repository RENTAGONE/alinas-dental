# Alina’s Dental Grace: multi-page site

Next.js 14 (App Router) · TypeScript strict · Tailwind · Framer Motion · lucide-react. Bangla by default, English toggle.

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # production check, then push to GitHub and import on Vercel

Pages: `/` · `/treatments` · `/treatments/[slug]` (6) · `/team` · `/process` · `/reviews` · `/contact` · `POST /api/lead`

## Where things live

| Change | File |
|---|---|
| Name, WhatsApp, phone, address, hours, Google rating and count, Maps link | `src/config/clinic.ts` |
| Treatments, ৳ ranges, tier bands, doctors, review themes, FAQ, process | `lib/data.ts` |
| Colours (R G B channels only) | `:root` in `app/globals.css`, `themeColor` in `app/layout.tsx`, 3 hex values in `app/icon.svg` |
| Lead scoring (`HIGH_TICKET`, `MID_TICKET`) | `app/api/lead/route.ts` |

Permutation: P02 palette · S02 split vault doors · H04 bento hero · N03 dual-deck header · M06 lotus and crown (`components/GraceLotus.tsx`) · F03 fonts · O02 section order.

## Rules the code follows

- Every ৳ figure, review count, rating, phone number and duration renders in `font-mono tabular-nums`, grouped South Asian style (`1,20,000`). In any `Bi` string, `{{...}}` marks a segment to set in monospace.
- Hours: `CLINIC.hours` and `CLINIC.schedule` drive the live Asia/Dhaka open/closed pill. Empty `hours` switches it to the live zone badge and hides hours everywhere.
- Doctor `years: 0`, empty `credentials`, empty `REVIEWS` and a missing case-photo pair all hide cleanly. Nothing is shown that the client did not confirm: no EMI, no equipment claims, no invented quotes.
- Review entries are labelled themes (paraphrases). Add `{ kind: "quote", author, text }` only for exact review text.
- Tier bands (Standard / Premium / Advanced) split the clinic’s listed range into three parts, so no figure leaves the range the clinic gave. Edit `TIERS` in `lib/data.ts` to move the edges.
- The splash plays on every load (nothing stored), with a Skip button and a 7-second CSS fail-safe if scripts never load.
- Counters use IntersectionObserver + requestAnimationFrame. `Reveal` only moves content (transform), it never fades it, so text cannot get stuck invisible.
- Bangla line-height stays at 1.35 or above (see the `html[lang="bn"]` rules in `globals.css`).

## Lead API

`POST /api/lead` takes the AppointmentPicker selection: honeypot, fill-time trap (under 2 s is dropped), Bangladesh mobile validation (phone is optional), spam filter, per-IP rate limit (5 per 10 min, per instance), scoring HOT / WARM / COLD. Treatment and slot whitelists come from `lib/data.ts`. Set `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` and/or `DISCORD_WEBHOOK_URL` (see `.env.example`); with none set, leads are written to the server log.

## Photos (drop into `public/images/`, no code change)

Shoot 4:5 portrait, about 1600 × 2000 px, subject centred. The site crops to 4:5, 3:4 and 4:3.

1. `treatments/implants.jpg`
2. `treatments/rct-crown.jpg`
3. `treatments/orthodontics.jpg`
4. `treatments/veneers.jpg`
5. `treatments/extraction.jpg`
6. `treatments/whitening.jpg`
7. `doctors/chief-consultant.jpg` (add `doctors/<slug>.jpg` for each dentist added to `DOCTORS`)
8. `results/implants-before.jpg`
9. `results/implants-after.jpg`
10. `results/rct-crown-before.jpg`
11. `results/rct-crown-after.jpg`
12. `results/orthodontics-before.jpg`
13. `results/orthodontics-after.jpg`
14. `results/veneers-before.jpg`
15. `results/veneers-after.jpg`
16. `results/extraction-before.jpg`
17. `results/extraction-after.jpg`
18. `results/whitening-before.jpg`
19. `results/whitening-after.jpg`

Files 8 to 19 are optional and work as pairs: a treatment page shows the drag-to-compare slider only when both its photos exist. Use real patient cases with written consent.

The site is set to `noindex` in `app/layout.tsx` while it is a preview; remove `robots` there at launch.

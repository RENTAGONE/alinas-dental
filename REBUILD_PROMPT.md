# Rebuild prompt for new demo sites

**How to use (about 2 minutes per demo):**
1. Open a **new chat** in this project. One chat per demo keeps it fast and cheap.
2. Attach `aura-medical-flagship.zip` (the full project zip).
3. Paste the prompt below, fill every `[BRACKET]`, send.
4. For a revamp of an existing client site, paste that site's text and the Google info into the CLIENT block. Raw is fine.

Photos can always be added after: drop files into `public/images/` (filenames are in README.md). Nothing else changes.

---

## THE PROMPT (copy everything in this block)

```
You are an elite Staff Frontend Engineer and UI/UX architect (Next.js App Router, TypeScript strict with zero `any`, Tailwind, Framer Motion, lucide-react). I attached aura-medical-flagship.zip: a finished multi-page, bilingual (Bangla default, English toggle) demo template. Turn it into a NEW demo for a different business. Keep the architecture, component quality and animation level. Change only what I list.

CLIENT
- Business name, niche, area/city: [..]
- Services with BDT price ranges (low to high, and whether per tooth / per session / per case): [..]
- Team: names, roles, years of experience: [..]
- Phone, WhatsApp number, address, opening hours, consultation fee: [..]
- What the client said and the info scraped from Google (paste raw): [..]
- Revamp only: the current website's text and sections (paste raw). Stay true to its facts, make it far better: [..]

LOOK
- Palette: [A / B / C / D from the palette list, or describe a mood]. Reskin by editing ONLY the :root block in app/globals.css, themeColor in app/layout.tsx and the hex values in app/icon.svg. The rest of the code is already token-driven. Do not hardcode colours anywhere.
- It must look clearly different from the Aura demo and from my other demos: change the hero composition, the display/body font pairing (keep a Bangla-capable fallback), the section order and the signature visual motif. Same premium level, not a recolour.
- Aim: it must look and feel like a 100,000 BDT website. Rich scroll-reveal animation on every section, lots of imagery slots, many real pages. No thin or "mid" pages.

DO NOT REGRESS (these are fixed in the template already)
1. Treatments section on the home page is the TABBED EXPLORER (components/TreatmentExplorer.tsx). Never a pinned horizontal-scroll gallery: it confused people.
2. The splash plays on EVERY page refresh: no sessionStorage or localStorage skip. Fade in, hold 1.5 seconds, slide up (ease 0.76, 0, 0.24, 1).
3. Stat counters use the IntersectionObserver + requestAnimationFrame Counter in components/Reveal.tsx. Never framer-motion's useInView + animate for counters.
4. Bangla is the default on every load. A popup appears 3 seconds after the splash: "Viewing in Bangla. Translate to English?" with English and Cancel.
5. The triage widget stays button-only and deterministic. Do not change its logic or routing. I will integrate my own triage engine later.
6. All copy is bilingual through bi(). Keep Bangla line-height at 1.3 or more so vowel signs are not clipped.
7. The contact form keeps posting to /api/lead (honeypot, fill-time trap, BD phone validation, spam filter, rate limit, scoring).

RULES
- All prices, names, reviews and claims are demo content unless I supplied them. Do not invent certifications as facts for a real client; keep placeholders obviously editable in lib/data.ts and lib/site.ts.
- Mobile first: tap targets 48px or more, no horizontal overflow, sticky mobile action bar.
- Animate only transform and opacity. Respect prefers-reduced-motion.
- Code first, minimal explanation. Do not ask questions unless something blocks the build; state assumptions in one line.

DELIVER
- Two zips, files at the top level with no wrapping folder: (1) changed-files-only, (2) the full project. If any file is deleted, list it in CHANGES.txt inside the changed-files zip.
- A numbered list of the exact photo filenames I need to add under public/images/.
- Run a syntax check on every file before zipping and tell me honestly what could not be tested.
```

---

## PALETTES (paste the block into `:root` in `app/globals.css`)

Token names are legacy: `ink` is the dark base, `lagoon` is the cool accent, `brass` is the warm accent (buttons, highlights), `porcelain` is the light section background. Each value is R G B channels.

### A. Midnight Navy & Champagne (premium dental, medical, corporate clinics)
Also set `themeColor` in `app/layout.tsx` to `#0A1128` and recolour the 3 hex values in `app/icon.svg`.
```css
:root {
  --ink-950: 10 17 40;
  --ink-900: 16 26 58;
  --ink-800: 24 37 79;
  --ink-700: 36 55 104;
  --lagoon-300: 169 199 245;
  --lagoon-400: 123 167 236;
  --lagoon-500: 74 127 214;
  --lagoon-600: 53 99 181;
  --brass-200: 243 230 200;
  --brass-300: 232 210 160;
  --brass-400: 216 184 116;
  --brass-500: 184 150 79;
  --porcelain: 244 246 250;
}
```

### B. Rose Quartz & Espresso (skin, aesthetics, salon, beauty)
Also set `themeColor` in `app/layout.tsx` to `#1E1412` and recolour the 3 hex values in `app/icon.svg`.
```css
:root {
  --ink-950: 30 20 18;
  --ink-900: 43 29 26;
  --ink-800: 60 42 37;
  --ink-700: 85 57 47;
  --lagoon-300: 244 201 196;
  --lagoon-400: 233 166 160;
  --lagoon-500: 217 127 122;
  --lagoon-600: 185 93 90;
  --brass-200: 243 220 196;
  --brass-300: 232 195 158;
  --brass-400: 214 161 115;
  --brass-500: 180 126 82;
  --porcelain: 250 244 241;
}
```

### C. Forest & Sand (wellness, organic, family clinics, physiotherapy)
Also set `themeColor` in `app/layout.tsx` to `#0B1A14` and recolour the 3 hex values in `app/icon.svg`.
```css
:root {
  --ink-950: 11 26 20;
  --ink-900: 17 38 29;
  --ink-800: 26 58 44;
  --ink-700: 38 80 64;
  --lagoon-300: 191 224 200;
  --lagoon-400: 140 198 160;
  --lagoon-500: 79 165 116;
  --lagoon-600: 58 129 89;
  --brass-200: 242 230 201;
  --brass-300: 230 210 163;
  --brass-400: 210 182 120;
  --brass-500: 173 145 82;
  --porcelain: 244 247 242;
}
```

### D. Plum & Pearl (women's health, luxury clinics, fertility, dermatology)
Also set `themeColor` in `app/layout.tsx` to `#170B1F` and recolour the 3 hex values in `app/icon.svg`.
```css
:root {
  --ink-950: 23 11 31;
  --ink-900: 34 17 46;
  --ink-800: 50 25 63;
  --ink-700: 71 36 90;
  --lagoon-300: 224 195 242;
  --lagoon-400: 199 153 230;
  --lagoon-500: 168 111 208;
  --lagoon-600: 134 80 174;
  --brass-200: 246 231 198;
  --brass-300: 236 211 160;
  --brass-400: 220 183 112;
  --brass-500: 184 147 75;
  --porcelain: 248 244 250;
}
```

---

## WHAT WAS FIXED IN THIS VERSION (v1.1)

- Home treatments: horizontal pin-scroll gallery replaced with the tabbed explorer.
- Splash now plays on every refresh.
- Stat counters rewritten (they were stuck at 0).
- Colours moved into one CSS variable block, so reskinning takes minutes.
- Language popup shows on every fresh load (Bangla is always the starting language).

---

## v1.2 LESSONS (from the Apollo build). Add these to the prompt

- NEVER a 1:1 copy: besides colours and copy, change the nav style, CTA band, footer top, doctor layout and the signature motif (Apollo: floating pill nav, split CTA, animated smile).
- /api/lead now derives its treatment whitelist from lib/data.ts, so renaming slugs cannot break the form. HIGH_TICKET and the scoring lines still use slugs: update them when slugs change.
- Empty hours, email, reviews and years hide automatically. Never claim EMI, warranty, sterilisation, equipment, or counts the client has not confirmed.
- DELIVER the FULL zip first. The changed-files zip only works laid over an existing repo (it does not contain tsconfig.json or unchanged files).
- Vercel: Framework Preset must be Next.js. When reusing a static project, clear the Build/Output overrides.

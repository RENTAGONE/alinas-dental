"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { bi } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { FAQS } from "@/lib/data";
import { useLang } from "./Providers";
import { Reveal, SOFT } from "./Reveal";
import { Section, SectionHead, Tx, type Tone } from "./ui";

export function FAQ({ tone = "light" }: { tone?: Tone }) {
  const { tr } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const dark = tone !== "light";
  return (
    <Section tone={tone}>
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead dark={dark} title={bi("সচরাচর জিজ্ঞাসা", "Common questions")} sub={bi("আরও জানতে চাইলে WhatsApp-এ সরাসরি লিখুন।", "Need more? Message the clinic directly on WhatsApp.")} />
        <Reveal>
          <ul className={cn("divide-y border-y", dark ? "divide-white/15 border-white/15" : "divide-ink-950/10 border-ink-950/10")}>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q.en}>
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left">
                    <span className="font-display text-lg font-semibold sm:text-xl">{tr(f.q)}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", dark ? "bg-brass-400 text-ink-950" : "bg-ink-950 text-white")}><Plus className="h-4 w-4" /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: SOFT }} className="overflow-hidden">
                        <p className={cn("max-w-2xl pb-6 text-lg", dark ? "text-white/75" : "text-ink-950/75")}><Tx b={f.a} /></p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

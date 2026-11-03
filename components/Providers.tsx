"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { Bi, Lang } from "@/lib/i18n";
import { Splash } from "./Splash";

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; tr: (b: Bi) => string; ready: boolean }
const Ctx = createContext<LangCtx | null>(null);

/** 0.5s fade-in + 1.5s hold, then the doors part. */
const SPLASH_MS = 2000;
/** The language prompt appears this long after the splash clears. */
const ASK_MS = 3000;

export function useLang(): LangCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used inside <Providers>");
  return c;
}

export function Providers({ children }: { children: ReactNode }) {
  // Bangla is the default on every load. The splash plays on every load: no storage, no skip flag.
  const [lang, setLang] = useState<Lang>("bn");
  const [splash, setSplash] = useState(true);
  const [askOpen, setAskOpen] = useState(false);
  const [askDone, setAskDone] = useState(false);

  const finish = useCallback(() => setSplash(false), []);
  useEffect(() => {
    const id = window.setTimeout(finish, SPLASH_MS);
    return () => window.clearTimeout(id);
  }, [finish]);

  useEffect(() => { document.body.style.overflow = splash ? "hidden" : ""; }, [splash]);
  useEffect(() => { document.documentElement.lang = lang; if (lang === "en") setAskOpen(false); }, [lang]);

  useEffect(() => {
    if (splash || askDone || lang === "en") return;
    const id = window.setTimeout(() => setAskOpen(true), ASK_MS);
    return () => window.clearTimeout(id);
  }, [splash, askDone, lang]);

  const closeAsk = (toEnglish: boolean) => {
    if (toEnglish) setLang("en");
    setAskOpen(false);
    setAskDone(true);
  };

  const value = useMemo<LangCtx>(() => ({ lang, setLang, tr: (b: Bi) => b[lang], ready: !splash }), [lang, splash]);

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}>
        <Splash show={splash} onSkip={finish} />
        {children}
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6">
          <AnimatePresence>
            {askOpen && (
              <motion.div
                key="ask" role="dialog" aria-label="Language"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-xl border border-white/15 bg-ink-900/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full sm:py-3 sm:pl-6 sm:pr-3"
              >
                <p className="flex-1 text-sm">Viewing in Bangla. Translate to English?</p>
                <div className="flex gap-2">
                  <button onClick={() => closeAsk(true)} className="min-h-12 flex-1 rounded-full bg-brass-400 px-5 text-sm font-semibold text-ink-950 hover:bg-brass-300">English</button>
                  <button onClick={() => closeAsk(false)} className="min-h-12 flex-1 rounded-full border border-white/25 px-5 text-sm text-white hover:bg-white/10">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </Ctx.Provider>
  );
}

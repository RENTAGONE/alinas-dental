"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Scroll reveal that can never hide content: it only moves (transform), it never fades, so text paints instantly
 * even if the observer never fires (the mobile hang seen with opacity-0 wrappers). Anything already scrolled past reveals at once.
 */
export function Reveal({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) { setShown(true); io.disconnect(); }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ transform: shown ? "none" : `translate3d(0, ${y}px, 0)`, transition: `transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s` }}
    >
      {children}
    </div>
  );
}

/**
 * Count-up that starts when the number scrolls into view.
 * Uses IntersectionObserver + requestAnimationFrame (no framer-motion hooks) so it cannot get stuck at 0.
 */
export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0) return;
    let raf = 0;
    const run = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / 1800, 1);
        setV(to * (1 - Math.pow(1 - p, 4)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") { setV(to); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);

  const text = v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref}>{text}{suffix}</span>;
}

export function Marquee({ children, reverse = false, className }: { children: ReactNode; reverse?: boolean; className?: string }) {
  const track = cn("flex min-w-full shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]");
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div className={track}>{children}</div>
      <div className={track} aria-hidden>{children}</div>
    </div>
  );
}

export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }} className="inline-block">
      {children}
    </motion.div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center bg-ink-950 px-6 text-center text-white">
      <p className="font-mono text-7xl text-brass-300">404</p>
      <p className="mt-4 text-lg text-white/70">This page does not exist.</p>
      <Link href="/" className="btn-brass mt-8">Back to home</Link>
    </section>
  );
}

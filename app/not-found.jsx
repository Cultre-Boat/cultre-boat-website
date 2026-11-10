import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 font-bellota-light tracking-widest">
      <p className="text-sm uppercase text-white/60">404</p>
      <h1 className="mt-4 text-3xl md:text-5xl">This page drifted away.</h1>
      <Link href="/" className="mt-10 uppercase text-sm border border-white/40 rounded-full px-6 py-3 hover:border-white transition-colors">
        Back to home
      </Link>
    </main>
  );
}

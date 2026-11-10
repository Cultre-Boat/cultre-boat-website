"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 font-bellota-light tracking-widest">
      <h1 className="text-3xl md:text-5xl">Something went wrong.</h1>
      <div className="mt-10 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="uppercase text-sm border border-white/40 rounded-full px-6 py-3 hover:border-white transition-colors"
        >
          Try again
        </button>
        <Link href="/" className="uppercase text-sm border border-white/40 rounded-full px-6 py-3 hover:border-white transition-colors">
          Home
        </Link>
      </div>
    </main>
  );
}

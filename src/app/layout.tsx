import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineHub",
  description: "Browse trending movies and shows, powered by TMDB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Cine<span className="text-[var(--accent)]">Hub</span>
            </Link>
            <nav className="flex gap-4 text-sm text-white/70">
              <Link href="/genre/action" className="hover:text-white">
                Action
              </Link>
              <Link href="/genre/comedy" className="hover:text-white">
                Comedy
              </Link>
              <Link href="/genre/drama" className="hover:text-white">
                Drama
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

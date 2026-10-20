/**
 * The top bar with the logo. Used on normal pages (not the live session).
 */
import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 lg:px-10">
      <Link href="/workout" className="flex items-center gap-3">
        <LogoMark />
        <span className="font-display text-lg font-bold">AI Coach</span>
      </Link>
    </header>
  );
}

/**
 * The top bar: logo, page links, and the logged-in user with Log out.
 * Used on normal pages (not the live session).
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogoMark } from "./LogoMark";

const LINKS = [
  { href: "/workout", label: "Train" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 lg:px-10">
      <Link href="/workout" className="flex items-center gap-3">
        <LogoMark />
        <span className="font-display text-lg font-bold">AI Coach</span>
      </Link>

      <nav className="flex flex-wrap gap-2">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm ${
                active ? "bg-raised font-semibold text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-line text-sm font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-ink/85">{user.name}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-3 py-2 text-sm text-muted hover:bg-raised hover:text-ink"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}

/**
 * LoginForm — email + password. On success, goes to the workout page.
 * If there's no account for that email, it points the user to sign up.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const NO_ACCOUNT = 404; // the backend's answer when the email isn't registered

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [noAccount, setNoAccount] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNoAccount(false);
    setBusy(true);
    try {
      await login(email, password);
      router.push("/workout");
    } catch (err) {
      setNoAccount(err instanceof ApiError && err.status === NO_ACCOUNT);
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted">Log in to continue your training.</p>
      </div>

      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {noAccount ? (
        <div role="alert" className="flex flex-col gap-3 rounded-xl bg-warn-soft px-4 py-4 text-sm text-warn">
          <span>{error}</span>
          <Link
            href="/signup"
            className="flex h-11 items-center justify-center rounded-xl bg-accent font-semibold text-ground hover:brightness-110"
          >
            Create an account
          </Link>
        </div>
      ) : (
        <ErrorMessage message={error} />
      )}

      <button
        type="submit"
        disabled={busy}
        className="h-13 rounded-xl bg-accent font-semibold text-ground hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Logging in…" : "Log in"}
      </button>

      <p className="text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

/**
 * SignupForm — name, email, password. On success, goes to the profile page
 * so the user can add their age, height, weight and goal.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const ALREADY_EXISTS = 409; // the backend's answer when the email is already registered

const MIN_PASSWORD_LENGTH = 8;

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setAlreadyExists(false);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setBusy(true);
    try {
      await signup(email, password, name);
      router.push("/profile");
    } catch (err) {
      setAlreadyExists(err instanceof ApiError && err.status === ALREADY_EXISTS);
      setError(err instanceof Error ? err.message : "Sign up failed.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-bold tracking-tight">Create your account</h2>
        <p className="text-muted">Save your workouts and get personal coaching.</p>
      </div>

      <TextField
        id="name"
        label="Name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        label={`Password (at least ${MIN_PASSWORD_LENGTH} characters)`}
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ErrorMessage message={error} />
      {alreadyExists && (
        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-xl border border-line-strong bg-raised font-semibold hover:bg-line"
        >
          Log in instead
        </Link>
      )}

      <button
        type="submit"
        disabled={busy}
        className="h-13 rounded-xl bg-accent font-semibold text-ground hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Creating account…" : "Create account"}
      </button>

      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

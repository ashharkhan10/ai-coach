/**
 * Profile page — http://localhost:3000/profile
 */
"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AppHeader } from "@/components/ui/AppHeader";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">Your profile</h1>
          <p className="text-muted">
            The AI coach uses this to personalise your advice. All fields except name are optional.
          </p>
        </div>
        <ProfileForm user={user} />
      </main>
    </div>
  );
}

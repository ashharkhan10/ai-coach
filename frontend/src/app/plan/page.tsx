/**
 * AI plan page — http://localhost:3000/plan
 *
 * The user picks their days, level, exercises and session length,
 * then the AI coach builds a weekly plan (also using their profile
 * and recent workouts).
 */
"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PlanDayCard } from "@/components/plan/PlanDayCard";
import { PlanOptionsForm } from "@/components/plan/PlanOptionsForm";
import { AppHeader } from "@/components/ui/AppHeader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { useWeeklyPlan } from "@/hooks/useWeeklyPlan";
import { formatDateTime } from "@/lib/history/format";
import { DEFAULT_OPTIONS } from "@/lib/plan/planOptions";

export default function PlanPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <PlanContent />
      </div>
    </RequireAuth>
  );
}

function PlanContent() {
  const { user } = useAuth();
  const { plan, loading, generating, error, makeNewPlan } = useWeeklyPlan();
  const profileIncomplete = !user?.goal;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">Your weekly plan</h1>
        <p className="text-muted">Pick what suits you — the AI coach builds the rest.</p>
      </div>

      {profileIncomplete && (
        <p className="rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          Tip: set your goal on the{" "}
          <Link href="/profile" className="font-semibold underline">
            profile page
          </Link>{" "}
          for a better plan.
        </p>
      )}

      {loading ? (
        <p className="text-muted">Loading your plan…</p>
      ) : (
        <PlanOptionsForm
          // Starts with the choices from the last plan, if there is one.
          key={plan?.id ?? "new"}
          initial={plan?.options ?? DEFAULT_OPTIONS}
          busy={generating}
          hasPlan={plan !== null}
          onSubmit={makeNewPlan}
        />
      )}

      <ErrorMessage message={error} />

      {plan && (
        <>
          <div className="flex flex-col gap-2 rounded-3xl border border-accent bg-accent-soft p-6">
            <span className="font-display text-2xl font-bold">{plan.plan.title}</span>
            <p className="leading-relaxed text-ink/85">{plan.plan.summary}</p>
            <span className="text-xs text-subtle">Created {formatDateTime(plan.created_at)}</span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {plan.plan.days.map((day, index) => (
              <PlanDayCard key={`${day.day}-${index}`} day={day} />
            ))}
          </div>

          <p className="rounded-2xl border border-line bg-surface p-5 text-sm">
            <span className="font-semibold text-accent">Coach tip: </span>
            {plan.plan.tip}
          </p>
        </>
      )}
    </main>
  );
}

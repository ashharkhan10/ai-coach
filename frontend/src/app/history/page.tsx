/**
 * History page — http://localhost:3000/history
 *
 * Weekly numbers, progress charts, badges and recent workouts.
 */
"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { BadgeGrid } from "@/components/history/BadgeGrid";
import { DailyChart } from "@/components/history/DailyChart";
import { StatCards } from "@/components/history/StatCards";
import { WorkoutTable } from "@/components/history/WorkoutTable";
import { AppHeader } from "@/components/ui/AppHeader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useHistoryData } from "@/hooks/useHistoryData";
import { niceMax } from "@/lib/history/format";

export default function HistoryPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <HistoryContent />
      </div>
    </RequireAuth>
  );
}

function HistoryContent() {
  const history = useHistoryData();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">Your progress</h1>
          <p className="text-muted">The last 14 days of training.</p>
        </div>
        <Link
          href="/workout"
          className="flex h-12 items-center rounded-xl bg-accent px-5 font-semibold text-ground hover:brightness-110"
        >
          New workout
        </Link>
      </div>

      {history.status === "loading" && <p className="text-muted">Loading your history…</p>}
      {history.status === "error" && <ErrorMessage message={history.message} />}

      {history.status === "ready" && (
        <>
          <StatCards stats={history.data.stats} />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
            <DailyChart
              title="Reps per day"
              subtitle="All exercises added together"
              points={history.data.stats.daily.map((d) => ({ day: d.day, value: d.reps || null }))}
              maxValue={niceMax(Math.max(...history.data.stats.daily.map((d) => d.reps)))}
              color="var(--color-accent)"
              unit="reps"
            />
            <DailyChart
              title="Form score per day"
              subtitle="Average of all sets that day"
              points={history.data.stats.daily.map((d) => ({ day: d.day, value: d.avg_form }))}
              maxValue={100}
              color="#4CC3FF"
              unit="/100"
            />
          </div>

          <BadgeGrid badges={history.data.badges} />
          <WorkoutTable workouts={history.data.workouts} />
        </>
      )}
    </main>
  );
}

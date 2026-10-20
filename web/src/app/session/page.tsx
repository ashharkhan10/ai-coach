/**
 * Live session page — for example:
 *   http://localhost:3000/session?exercise=squat&sets=3&reps=10
 *
 * Reads the plan from the address, then shows the live session.
 * The address is only known when someone visits, so that part sits
 * inside <Suspense> and shows "Loading…" for a moment.
 */
import { Suspense } from "react";
import { LiveSession } from "@/components/session/LiveSession";
import { parsePlan } from "@/lib/workout/plan";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function SessionPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<p className="p-6 text-muted">Loading…</p>}>
      <SessionFromAddress searchParams={searchParams} />
    </Suspense>
  );
}

async function SessionFromAddress({ searchParams }: { searchParams: SearchParams }) {
  const plan = parsePlan(await searchParams);

  // The key makes React start fresh if the plan changes.
  const key = `${plan.exerciseId}-${plan.sets}-${plan.repsPerSet}`;

  return <LiveSession key={key} plan={plan} />;
}

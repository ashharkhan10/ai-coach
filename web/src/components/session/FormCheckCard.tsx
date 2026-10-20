/**
 * FormCheckCard — form score for this set, live angles and the current tip.
 */
import type { ExerciseResult } from "@/lib/exercises/types";

type Props = {
  result: ExerciseResult | null;
};

export function FormCheckCard({ result }: Props) {
  const formScore = result?.formScore ?? 100;
  const angles = result?.angles ?? {};

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <span className="text-xs font-semibold uppercase tracking-widest text-subtle">Form check</span>

      <div className="flex items-center justify-between">
        <span>Form score</span>
        <span className={`font-display text-xl font-bold ${scoreColor(formScore)}`}>
          {formScore}/100
        </span>
      </div>

      {Object.entries(angles).map(([label, value]) => (
        <div key={label} className="flex items-center justify-between">
          <span>{label}</span>
          <span className="font-display text-xl font-bold">{value}°</span>
        </div>
      ))}

      {result?.issue ? (
        <p className="rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">{result.issue}</p>
      ) : (
        result && <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">Form looks good — keep going!</p>
      )}
    </div>
  );
}

/** Lime for good, orange for okay, red for poor. */
function scoreColor(score: number): string {
  if (score >= 80) return "text-accent";
  if (score >= 50) return "text-warn";
  return "text-danger";
}

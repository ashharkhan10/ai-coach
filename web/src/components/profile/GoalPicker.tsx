/**
 * GoalPicker — three buttons: Lose weight / Build muscle / Stay fit.
 */
import type { Goal } from "@/lib/api/auth";

const GOALS: { id: Goal; label: string }[] = [
  { id: "lose_weight", label: "Lose weight" },
  { id: "build_muscle", label: "Build muscle" },
  { id: "stay_fit", label: "Stay fit" },
];

type Props = {
  value: Goal | null;
  onChange: (goal: Goal) => void;
};

export function GoalPicker({ value, onChange }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold text-ink/85">Your goal</legend>
      <div className="grid grid-cols-3 gap-3">
        {GOALS.map((goal) => {
          const selected = goal.id === value;
          return (
            <button
              key={goal.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(goal.id)}
              className={`h-13 rounded-xl border-2 text-sm font-semibold ${
                selected
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

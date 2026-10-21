/**
 * PlanOptionsForm — the choices before creating a plan:
 * training days, split, level, exercises and session length.
 */
"use client";

import { useState } from "react";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { EXERCISES } from "@/lib/exercises";
import {
  SPLITS,
  WEEKDAYS,
  problemWith,
  sortWeekdays,
  toggle,
  type Level,
  type PlanOptions,
  type SessionMinutes,
} from "@/lib/plan/planOptions";

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const LENGTHS: { value: SessionMinutes; label: string }[] = [
  { value: 10, label: "10 min" },
  { value: 20, label: "20 min" },
  { value: 30, label: "30 min" },
];

type Props = {
  initial: PlanOptions;
  busy: boolean;
  hasPlan: boolean;
  onSubmit: (options: PlanOptions) => void;
};

export function PlanOptionsForm({ initial, busy, hasPlan, onSubmit }: Props) {
  const [options, setOptions] = useState(initial);
  const problem = problemWith(options);
  const dayCount = options.weekdays.length;
  const chosenSplit = SPLITS.find((s) => s.value === options.split);

  return (
    <section className="flex flex-col gap-7 rounded-3xl border border-line bg-surface p-6 lg:p-8">
      <ChoiceChips
        label="Training days"
        hint={`${dayCount} ${dayCount === 1 ? "day" : "days"} a week`}
        choices={WEEKDAYS.map((day) => ({ value: day, label: day.slice(0, 3) }))}
        isSelected={(day) => options.weekdays.includes(day)}
        onClick={(day) => setOptions({ ...options, weekdays: sortWeekdays(toggle(options.weekdays, day)) })}
      />

      <div className="flex flex-col gap-3">
        <ChoiceChips
          label="Workout split"
          choices={SPLITS}
          isSelected={(split) => options.split === split}
          onClick={(split) => setOptions({ ...options, split })}
        />
        {chosenSplit && <p className="text-sm text-muted">{chosenSplit.description}</p>}
      </div>

      <ChoiceChips
        label="Level"
        choices={LEVELS}
        isSelected={(level) => options.level === level}
        onClick={(level) => setOptions({ ...options, level })}
      />

      <ChoiceChips
        label="Exercises"
        hint="Pick the ones you want in your plan"
        choices={EXERCISES.map((e) => ({ value: e.id, label: e.name }))}
        isSelected={(id) => options.exercises.includes(id)}
        onClick={(id) => setOptions({ ...options, exercises: toggle(options.exercises, id) })}
      />

      <ChoiceChips
        label="Session length"
        choices={LENGTHS}
        isSelected={(minutes) => options.minutes === minutes}
        onClick={(minutes) => setOptions({ ...options, minutes })}
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => onSubmit(options)}
          disabled={busy || problem !== null}
          className="h-12 rounded-xl bg-accent px-6 font-semibold text-ground hover:brightness-110 disabled:opacity-50"
        >
          {busy ? "Creating your plan…" : hasPlan ? "Make a new plan" : "Create my plan"}
        </button>
        {problem && <span className="text-sm text-warn">{problem}</span>}
      </div>
    </section>
  );
}

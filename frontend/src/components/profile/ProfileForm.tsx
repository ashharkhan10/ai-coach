/**
 * ProfileForm — name, age, height, weight and goal.
 * The AI coach uses these to personalise its advice.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { updateMe, type Goal, type User } from "@/lib/api/auth";
import { GoalPicker } from "./GoalPicker";

/** Empty box → null, otherwise a number. */
function toNumberOrNull(text: string): number | null {
  return text.trim() === "" ? null : Number(text);
}

/** null → empty box, otherwise the number as text. */
function toText(value: number | null): string {
  return value === null ? "" : String(value);
}

export function ProfileForm({ user }: { user: User }) {
  const { token, setUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(toText(user.age));
  const [height, setHeight] = useState(toText(user.height_cm));
  const [weight, setWeight] = useState(toText(user.weight_kg));
  const [goal, setGoal] = useState<Goal | null>(user.goal);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setBusy(true);
    try {
      const updated = await updateMe(token, {
        name,
        age: toNumberOrNull(age),
        height_cm: toNumberOrNull(height),
        weight_kg: toNumberOrNull(weight),
        goal,
      });
      setUser(updated);
      router.push("/workout");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <TextField id="name" label="Name" required value={name} onChange={(e) => setName(e.target.value)} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        <TextField
          id="age"
          label="Age"
          type="number"
          min={10}
          max={100}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          id="height"
          label="Height (cm)"
          type="number"
          min={100}
          max={250}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <TextField
          id="weight"
          label="Weight (kg)"
          type="number"
          min={25}
          max={300}
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <GoalPicker value={goal} onChange={setGoal} />

      <ErrorMessage message={error} />

      <button
        type="submit"
        disabled={busy}
        className="h-13 rounded-xl bg-accent font-semibold text-ground hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save and start training"}
      </button>
    </form>
  );
}

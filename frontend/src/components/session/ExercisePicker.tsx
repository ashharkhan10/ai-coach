/**
 * ExercisePicker — a row of buttons to switch exercise.
 * (Temporary: the full setup screen comes in a later milestone.)
 */
import { EXERCISES, type ExerciseId } from "@/lib/exercises";

type Props = {
  selected: ExerciseId;
  onSelect: (id: ExerciseId) => void;
};

export function ExercisePicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXERCISES.map((exercise) => {
        const isSelected = exercise.id === selected;
        return (
          <button
            key={exercise.id}
            type="button"
            onClick={() => onSelect(exercise.id)}
            className={
              isSelected
                ? "h-11 rounded-xl bg-[#C6F432] px-4 font-semibold text-[#0E0F11]"
                : "h-11 rounded-xl border border-[#2E3238] bg-[#17191D] px-4 hover:bg-[#23262B]"
            }
          >
            {exercise.name}
          </button>
        );
      })}
    </div>
  );
}

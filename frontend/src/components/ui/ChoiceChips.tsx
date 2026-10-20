/**
 * ChoiceChips — a row of pill buttons. Selected ones are lime.
 * Works for "pick one" and "pick many": the parent decides what a click does.
 */
type Choice<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  label: string;
  hint?: string;
  choices: Choice<T>[];
  isSelected: (value: T) => boolean;
  onClick: (value: T) => void;
};

export function ChoiceChips<T extends string | number>({ label, hint, choices, isSelected, onClick }: Props<T>) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-sm font-semibold text-ink/85">{label}</span>
        {hint && <span className="text-sm text-subtle">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => {
          const selected = isSelected(choice.value);
          return (
            <button
              key={String(choice.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onClick(choice.value)}
              className={`h-11 rounded-xl border-2 px-4 text-sm font-semibold transition-colors ${
                selected
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-ink hover:border-line-strong"
              }`}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

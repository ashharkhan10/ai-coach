/**
 * NumberStepper — a number with − and + buttons (for sets and reps).
 */
type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function NumberStepper({ label, value, min, max, onChange }: Props) {
  const buttonClass =
    "h-11 w-11 rounded-xl border border-line-strong bg-raised text-xl hover:bg-line disabled:opacity-40";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className={buttonClass}
        >
          −
        </button>
        <span className="w-12 text-center font-display text-2xl font-bold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className={buttonClass}
        >
          +
        </button>
      </div>
    </div>
  );
}

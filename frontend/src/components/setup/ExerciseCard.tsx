/**
 * ExerciseCard — one selectable exercise on the setup screen.
 */
type Props = {
  name: string;
  tracks: string;
  selected: boolean;
  onSelect: () => void;
};

export function ExerciseCard({ name, tracks, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex min-h-40 flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-colors ${
        selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          selected ? "bg-accent text-ground" : "bg-line text-ink"
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="4.5" r="2" />
          <path d="M12 7v6M8 10h8M12 13l-3 7M12 13l3 7" />
        </svg>
      </div>
      <span className="font-display text-xl font-bold">{name}</span>
      <span className="text-sm leading-relaxed text-muted">{tracks}</span>
    </button>
  );
}

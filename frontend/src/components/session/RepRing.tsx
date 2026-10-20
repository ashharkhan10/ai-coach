/**
 * RepRing — the circular progress ring with the rep count in the middle.
 */
type Props = {
  reps: number;
  target: number;
};

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RepRing({ reps, target }: Props) {
  const progress = target > 0 ? Math.min(1, reps / target) : 0;
  const filledLength = progress * CIRCUMFERENCE;

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {/* Grey track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="var(--color-line)"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Lime progress (starts at the top) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="var(--color-accent)"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${CIRCUMFERENCE}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className="transition-[stroke-dasharray] duration-300"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-7xl font-bold leading-none tabular-nums">{reps}</span>
        <span className="text-muted">of {target} reps</span>
      </div>
    </div>
  );
}

/**
 * StatCards — the four headline numbers at the top of the history page.
 */
import type { Stats } from "@/lib/api/workouts";

export function StatCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Reps this week", value: stats.week_reps },
    { label: "Sets this week", value: stats.week_sets },
    { label: "Minutes trained", value: stats.week_minutes },
    { label: "Day streak", value: stats.streak_days, highlight: true },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5">
          <span className="text-sm text-muted">{card.label}</span>
          <span className={`font-display text-4xl font-bold ${card.highlight ? "text-accent" : ""}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}

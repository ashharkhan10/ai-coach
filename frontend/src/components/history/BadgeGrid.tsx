/**
 * BadgeGrid — every badge. Earned ones are bright; locked ones are dim.
 */
import type { Badge } from "@/lib/api/workouts";
import { formatDateTime } from "@/lib/history/format";

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earnedCount = badges.filter((b) => b.earned_at).length;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Badges</h2>
        <span className="text-sm text-muted">
          {earnedCount} of {badges.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {badges.map((badge) => {
          const earned = badge.earned_at !== null;
          return (
            <div
              key={badge.id}
              className={`flex flex-col gap-2 rounded-2xl border p-5 ${
                earned ? "border-accent bg-accent-soft" : "border-line bg-surface opacity-60"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl ${
                  earned ? "bg-accent text-ground" : "bg-line text-subtle"
                }`}
                aria-hidden="true"
              >
                {earned ? "★" : "?"}
              </span>
              <span className="font-display text-lg font-bold">{badge.name}</span>
              <span className="text-sm text-muted">{badge.description}</span>
              <span className="text-xs text-subtle">
                {earned ? `Unlocked ${formatDateTime(badge.earned_at!)}` : "Locked"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

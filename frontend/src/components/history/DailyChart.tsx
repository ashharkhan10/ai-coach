/**
 * DailyChart — a simple column chart with one bar per day.
 *
 * Used twice on the history page: reps per day, and form score per day.
 * Hover (or tab to) a day to see its exact value.
 * "View as table" shows the same numbers as text.
 */
"use client";

import { useState } from "react";
import { dayNumber, formatDay } from "@/lib/history/format";

export type ChartPoint = {
  day: string; // "2026-10-20"
  value: number | null; // null = no workout that day
};

type Props = {
  title: string;
  subtitle: string;
  points: ChartPoint[];
  maxValue: number;
  color: string; // CSS colour for the bars
  unit: string; // e.g. "reps" or "/100"
};

const CHART_HEIGHT = 160; // px

export function DailyChart({ title, subtitle, points, maxValue, color, unit }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gridValues = [maxValue, maxValue / 2, 0];

  const describe = (point: ChartPoint) =>
    point.value === null ? "No workout" : `${point.value} ${unit}`.replace(" /", "/");

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="flex gap-3">
        {/* Y axis numbers */}
        <div className="flex flex-col justify-between text-right text-xs text-subtle" style={{ height: CHART_HEIGHT }}>
          {gridValues.map((v) => (
            <span key={v}>{Math.round(v)}</span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Plot area */}
          <div className="relative" style={{ height: CHART_HEIGHT }}>
            {/* Hairline grid */}
            {gridValues.map((v) => (
              <div
                key={v}
                className="absolute inset-x-0 h-px bg-line"
                style={{ bottom: `${(v / maxValue) * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-0.5">
              {points.map((point, index) => {
                const heightPercent = point.value === null ? 0 : (point.value / maxValue) * 100;
                const isHovered = hovered === index;
                return (
                  <button
                    key={point.day}
                    type="button"
                    aria-label={`${formatDay(point.day)}: ${describe(point)}`}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    className={`relative flex h-full flex-1 items-end justify-center rounded-md outline-none ${
                      isHovered ? "bg-raised" : ""
                    }`}
                  >
                    {point.value !== null && (
                      <span
                        className="w-full max-w-6 rounded-t"
                        style={{ height: `${Math.max(heightPercent, 1.5)}%`, background: color }}
                      />
                    )}

                    {/* Tooltip */}
                    {isHovered && (
                      <span className="pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-lg border border-line-strong bg-ground px-3 py-2 text-left text-xs">
                        <span className="block text-muted">{formatDay(point.day)}</span>
                        <span className="block font-semibold text-ink">{describe(point)}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day numbers */}
          <div className="flex gap-0.5 text-center text-xs text-subtle">
            {points.map((point) => (
              <span key={point.day} className="flex-1">
                {dayNumber(point.day)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Same data as a table */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-ink">View as table</summary>
        <table className="mt-3 w-full text-left">
          <tbody>
            {points.map((point) => (
              <tr key={point.day} className="border-t border-line">
                <td className="py-2 text-muted">{formatDay(point.day)}</td>
                <td className="py-2">{describe(point)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

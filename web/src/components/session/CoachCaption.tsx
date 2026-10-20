/**
 * CoachCaption — the coach's latest words, shown at the bottom of the camera.
 * (So the advice is readable too, even when muted.)
 */
type Props = {
  text: string | null;
};

export function CoachCaption({ text }: Props) {
  if (!text) return null;

  return (
    <div className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl border border-line-strong bg-ground/90 px-5 py-4">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent text-ground">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M19 11a7 7 0 01-14 0M12 18v4" />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-subtle">Coach</span>
        <span aria-live="polite" className="text-base leading-relaxed lg:text-lg">
          {text}
        </span>
      </div>
    </div>
  );
}

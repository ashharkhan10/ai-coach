/**
 * MuteButton — turns the coach's voice on or off.
 */
type Props = {
  muted: boolean;
  onToggle: () => void;
};

export function MuteButton({ muted, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Unmute voice coach" : "Mute voice coach"}
      aria-pressed={muted}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-surface hover:bg-raised"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        {muted ? (
          <path d="M23 9l-6 6M17 9l6 6" />
        ) : (
          <path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14" />
        )}
      </svg>
    </button>
  );
}

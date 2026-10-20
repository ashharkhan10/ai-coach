/**
 * The AI Coach logo: a dumbbell in a lime square.
 */
type Props = {
  size?: number;
};

export function LogoMark({ size = 32 }: Props) {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-accent"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.56}
        height={size * 0.56}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0E0F11"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" />
      </svg>
    </div>
  );
}

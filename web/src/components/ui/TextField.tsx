/**
 * TextField — a label with an input box under it.
 */
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function TextField({ id, label, ...inputProps }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink/85">
        {label}
      </label>
      <input
        id={id}
        className="h-13 rounded-xl border border-line-strong bg-surface px-4 text-ink outline-none placeholder:text-subtle focus:border-accent"
        {...inputProps}
      />
    </div>
  );
}

/**
 * ErrorMessage — a red box for form errors. Shows nothing if there's no error.
 */
export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
      {message}
    </p>
  );
}

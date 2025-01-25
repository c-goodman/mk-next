export function ZodErrorMessage({
  id,
  error,
}: {
  id: string;
  error: string | undefined;
}) {
  if (!error) return null;
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      <div key={id} className="text-red-500 text-xs italic mt-1 py-2">
        {error}
      </div>
    </div>
  );
}

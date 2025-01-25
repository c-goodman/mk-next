export function ZodErrorMessage({
  id,
  error,
}: {
  id: string;
  error: string[] | undefined;
}) {
  if (!error) return null;
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {error.map((err: string, index: number) => (
        <div key={index} className="text-red-500 text-xs italic mt-1 py-2">
          {err}
        </div>
      ))}
    </div>
  );
}

export default function EmptyState({ title = "Nothing here yet", message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        className="mb-4 text-[var(--color-text-secondary)]"
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m-9 5h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
        />
      </svg>
      <h3 className="text-h3 text-[var(--color-text-primary)] mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
      )}
    </div>
  );
}

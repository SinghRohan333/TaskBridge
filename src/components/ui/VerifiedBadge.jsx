export default function VerifiedBadge({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Verified freelancer"
      title="Verified freelancer"
    >
      <path
        fill="var(--color-brand-blue)"
        d="M12 2l2.2 1.6 2.7-.3 1 2.5 2.5 1-.3 2.7L22 12l-1.6 2.2.3 2.7-2.5 1-1 2.5-2.7-.3L12 22l-2.2-1.6-2.7.3-1-2.5-2.5-1 .3-2.7L2 12l1.6-2.2-.3-2.7 2.5-1 1-2.5 2.7.3z"
      />
      <path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 12.5l2.3 2.3 4.7-4.7"
      />
    </svg>
  );
}

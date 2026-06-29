export default function StarRating({ rating = 0, size = 16 }) {
  const roundedToHalf = Math.round(rating * 2) / 2;
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {stars.map((star) => {
        const fillLevel =
          roundedToHalf >= star
            ? "full"
            : roundedToHalf >= star - 0.5
              ? "half"
              : "empty";

        return (
          <svg key={star} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${star}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z"
              fill={
                fillLevel === "full"
                  ? "#f59e0b"
                  : fillLevel === "half"
                    ? `url(#half-${star})`
                    : "#e5e7eb"
              }
            />
          </svg>
        );
      })}
      <span className="text-xs text-[var(--color-text-secondary)] ml-1">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
    </div>
  );
}

import Link from "next/link";

const categoryColors = {
  Design: "bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)]",
  Writing: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  Development: "bg-[#ede9fe] text-[var(--color-admin-purple)]",
  Marketing: "bg-[#fef3c7] text-[#92400e]",
  Other: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
};

export default function TaskCard({ task }) {
  const categoryStyle = categoryColors[task.category] || categoryColors.Other;
  const deadline = new Date(task.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/browse-tasks/${task._id}`}
      className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <span
        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle} mb-3`}
      >
        {task.category}
      </span>

      <h3 className="text-h3 text-[var(--color-text-primary)] mb-1 line-clamp-2">
        {task.title}
      </h3>

      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        by {task.client_name || "Client"}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-success-green)]">
          ${task.budget}
        </span>
        <span className="text-xs text-[var(--color-text-secondary)]">
          Due {deadline}
        </span>
      </div>
    </Link>
  );
}

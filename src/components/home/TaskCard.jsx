"use client";

import Link from "next/link";
import { useBookmarks } from "@/context/BookmarksContext";

const categoryColors = {
  Design: "bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)]",
  Writing: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  Development: "bg-[#ede9fe] text-[var(--color-admin-purple)]",
  Marketing: "bg-[#fef3c7] text-[#92400e]",
  Other: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
};

export default function TaskCard({ task }) {
  const { bookmarkedIds, toggle, isFreelancer } = useBookmarks();
  const isBookmarked = bookmarkedIds.has(task._id);

  const categoryStyle = categoryColors[task.category] || categoryColors.Other;
  const deadline = new Date(task.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(task._id);
  };

  return (
    <Link
      href={`/browse-tasks/${task._id}`}
      className="relative block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {isFreelancer && (
        <button
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark task"}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-blue)] transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "var(--color-brand-blue)" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
          </svg>
        </button>
      )}

      <span
        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle} mb-3`}
      >
        {task.category}
      </span>

      <h3 className="text-h3 text-[var(--color-text-primary)] mb-1 line-clamp-2 pr-6">
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

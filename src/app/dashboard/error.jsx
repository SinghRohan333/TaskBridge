"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard render error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-[var(--color-danger)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-8.25 3.75h.008v.008h-.008v-.008z"
            />
          </svg>
        </div>

        <h2 className="text-h2 text-[var(--color-text-primary)] mb-2">
          Something went wrong
        </h2>

        <p className="text-body text-[var(--color-text-secondary)] mb-6">
          This part of your dashboard ran into an unexpected error. You can try
          again, or head back to your overview.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-[#e5e7eb] text-[var(--color-text-primary)] hover:bg-[#f9fafb] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

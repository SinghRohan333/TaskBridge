"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/browse-tasks?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm font-medium border border-[#e5e7eb] rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3f4f6] transition-colors"
      >
        Previous
      </button>

      <span className="text-sm text-[var(--color-text-secondary)]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm font-medium border border-[#e5e7eb] rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3f4f6] transition-colors"
      >
        Next
      </button>
    </div>
  );
}

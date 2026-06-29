"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

export default function SearchAndFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 300);

  // Push debounced search to URL, reset to page 1
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearch === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/browse-tasks?${params.toString()}`);
  }, [debouncedSearch]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/browse-tasks?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search tasks by title..."
        className="flex-1 border border-[#e5e7eb] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
      />

      <select
        value={searchParams.get("category") || ""}
        onChange={handleCategoryChange}
        className="border border-[#e5e7eb] rounded-md px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] sm:w-48"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

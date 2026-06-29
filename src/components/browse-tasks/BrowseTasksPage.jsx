"use client";

import SearchAndFilterBar from "./SearchAndFilterBar";
import TaskGrid from "./TaskGrid";

export default function BrowseTasksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Browse Tasks
      </h1>
      <SearchAndFilterBar />
      <TaskGrid />
    </div>
  );
}

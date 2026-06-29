import { Suspense } from "react";
import BrowseTasksPage from "@/components/browse-tasks/BrowseTasksPage";

export const metadata = {
  title: "Browse Tasks — TaskBridge",
};

function BrowseTasksFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <div className="h-9 w-48 bg-[#e5e7eb] rounded animate-pulse mb-6" />
      <div className="h-11 bg-[#e5e7eb] rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-40 bg-[#e5e7eb] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<BrowseTasksFallback />}>
      <BrowseTasksPage />
    </Suspense>
  );
}

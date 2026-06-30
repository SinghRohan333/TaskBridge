"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import TaskCard from "@/components/home/TaskCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { useBookmarks } from "@/context/BookmarksContext";

export default function BookmarkedTasksPage() {
  const { bookmarkedIds } = useBookmarks();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/bookmarks")
      .then((data) => setTasks(data.tasks || []))
      .catch(() => toast.error("Failed to load bookmarked tasks."))
      .finally(() => setLoading(false));
  }, [bookmarkedIds.size]);

  return (
    <>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Bookmarked Tasks
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          message="Save interesting tasks while browsing to find them here later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </>
  );
}

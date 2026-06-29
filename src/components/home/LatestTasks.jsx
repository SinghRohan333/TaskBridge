"use client";

import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { apiFetch } from "@/lib/api";

export default function LatestTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/tasks/latest")
      .then((data) => setTasks(data.tasks))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 md:px-6 py-16 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-h1 text-[var(--color-text-primary)] mb-8">
          Latest Featured Tasks
        </h2>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : tasks.map((task) => <TaskCard key={task._id} task={task} />)}
        </div>

        {!loading && tasks.length === 0 && !error && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No open tasks right now — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}

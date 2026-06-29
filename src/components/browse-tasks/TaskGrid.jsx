"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TaskCard from "@/components/home/TaskCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "./Pagination";
import { apiFetch } from "@/lib/api";

export default function TaskGrid() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", String(page));
    params.set("limit", "9");

    apiFetch(`/api/tasks?${params.toString()}`)
      .then((data) => {
        setTasks(data.tasks);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  if (error) {
    return <p className="text-sm text-[var(--color-danger)]">{error}</p>;
  }

  if (!loading && tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        message="Try adjusting your search or category filter."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : tasks.map((task) => <TaskCard key={task._id} task={task} />)}
      </div>

      {!loading && <Pagination currentPage={page} totalPages={totalPages} />}
    </>
  );
}

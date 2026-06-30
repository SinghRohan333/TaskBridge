"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { categoryColors } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubmitDeliverableModal from "./SubmitDeliverableModal";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

export default function ActiveProjectsPage() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(`/api/tasks/active?freelancer_email=${encodeURIComponent(email)}`)
      .then((data) => setTasks(data.tasks))
      .catch(() => toast.error("Failed to load projects."))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Active Projects
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No active projects"
          message="Once a client accepts your proposal and pays, the project will appear here."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {/* In progress */}
          {inProgress.length > 0 && (
            <div>
              <h2 className="text-h3 text-[var(--color-text-primary)] mb-4">
                In Progress ({inProgress.length})
              </h2>
              <div className="flex flex-col gap-4">
                {inProgress.map((task) => {
                  const catStyle =
                    categoryColors[task.category] || categoryColors.Other;
                  const deadline = new Date(task.deadline).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  );

                  return (
                    <div
                      key={task._id}
                      className="bg-white border border-[#e5e7eb] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                          >
                            {task.category}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e]">
                            In Progress
                          </span>
                        </div>
                        <h3 className="text-h3 text-[var(--color-text-primary)] mb-1">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)]">
                          <span>
                            Client:{" "}
                            <span className="font-medium">
                              {task.client_name}
                            </span>
                          </span>
                          <span>
                            Budget:{" "}
                            <span className="font-semibold text-[var(--color-success-green)]">
                              $
                              {task.proposal?.proposed_budget?.toLocaleString()}
                            </span>
                          </span>
                          <span>Due: {deadline}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="flex-shrink-0 text-sm font-semibold text-white bg-[var(--color-success-green)] hover:bg-[var(--color-green-dark)] px-5 py-2.5 rounded-lg transition-colors"
                      >
                        Submit Deliverable
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-h3 text-[var(--color-text-primary)] mb-4">
                Completed ({completed.length})
              </h2>
              <div className="flex flex-col gap-4">
                {completed.map((task) => {
                  const catStyle =
                    categoryColors[task.category] || categoryColors.Other;

                  return (
                    <div
                      key={task._id}
                      className="bg-white border border-[#e5e7eb] rounded-xl p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                        >
                          {task.category}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f3f4f6] text-[var(--color-text-secondary)]">
                          Completed
                        </span>
                      </div>
                      <h3 className="text-h3 text-[var(--color-text-primary)] mb-1">
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)] mb-3">
                        <span>
                          Client:{" "}
                          <span className="font-medium">
                            {task.client_name}
                          </span>
                        </span>
                        <span>
                          Earned:{" "}
                          <span className="font-semibold text-[var(--color-success-green)]">
                            ${task.proposal?.proposed_budget?.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      {task.deliverable_url && (
                        <Link
                          href={task.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors"
                        >
                          View deliverable →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <SubmitDeliverableModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSuccess={() => {
          setSelectedTask(null);
          fetchTasks();
        }}
      />
    </DashboardLayout>
  );
}

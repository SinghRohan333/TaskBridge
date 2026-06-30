"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TaskTable from "@/components/dashboard/client/TaskTable";
import EditTaskModal from "@/components/dashboard/client/EditTaskModal";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Link from "next/link";

export default function MyTasksPage() {
  const { data: session } = authClient.useSession();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTasks = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(`/api/tasks/mine?client_email=${encodeURIComponent(email)}`)
      .then((data) => setTasks(data.tasks))
      .catch(() => toast.error("Failed to load your tasks."))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEditSuccess = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;

    setDeleteLoading(true);
    try {
      await apiFetch(`/api/tasks/${deletingTask._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_email: session?.user?.email }),
      });

      toast.success("Task deleted successfully.");
      setDeletingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.message || "Failed to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-[var(--color-text-primary)]">My Tasks</h1>

        <Link
          href="/dashboard/client/post-task"
          className="text-sm font-semibold text-white bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] px-4 py-2 rounded-lg transition-colors"
        >
          + Post a Task
        </Link>
      </div>

      {/* Task list */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl">
        {loading ? (
          <div className="flex flex-col gap-4 p-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            message="Post your first task and start receiving proposals from freelancers."
          />
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(task) => setDeletingTask(task)}
          />
        )}
      </div>

      {/* Edit modal */}
      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSuccess={handleEditSuccess}
      />

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingTask && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleteLoading && setDeletingTask(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-h3 text-[var(--color-text-primary)] mb-2">
                  Delete this task?
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {deletingTask.title}
                  </span>{" "}
                  will be permanently removed. This cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeletingTask(null)}
                    disabled={deleteLoading}
                    className="px-5 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-danger)] hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

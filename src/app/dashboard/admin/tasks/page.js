"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminTasksTable from "@/components/dashboard/admin/AdminTasksTable";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function ManageTasksPage() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email;

  const loadTasks = () => {
    if (!adminEmail) return;
    setLoading(true);
    apiFetch(`/api/admin/tasks?admin_email=${encodeURIComponent(adminEmail)}`)
      .then((data) => setTasks(data.tasks))
      .catch(() => toast.error("Failed to load tasks."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [adminEmail]);

  const handleDelete = async (task) => {
    try {
      await apiFetch(`/api/admin/tasks/${task._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: adminEmail }),
      });
      toast.success("Task deleted.");
      loadTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Manage Tasks
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Posted tasks will show up here."
        />
      ) : (
        <AdminTasksTable tasks={tasks} onDelete={handleDelete} />
      )}
    </DashboardLayout>
  );
}

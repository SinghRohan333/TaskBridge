"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email;

  const loadUsers = () => {
    if (!adminEmail) return;
    setLoading(true);
    apiFetch(`/api/admin/users?admin_email=${encodeURIComponent(adminEmail)}`)
      .then((data) => setUsers(data.users))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [adminEmail]);

  const handleBlock = async (user) => {
    try {
      await apiFetch(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: adminEmail }),
      });
      toast.success(`${user.name} has been blocked.`);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUnblock = async (user) => {
    try {
      await apiFetch(`/api/admin/users/${user._id}/unblock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: adminEmail }),
      });
      toast.success(`${user.name} has been unblocked.`);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerify = async (user) => {
    try {
      await apiFetch(`/api/admin/users/${user._id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: adminEmail }),
      });
      toast.success(`${user.name} is now verified.`);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Manage Users
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users yet"
          message="Users will appear here once people sign up."
        />
      ) : (
        <UsersTable
          users={users}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onVerify={handleVerify}
        />
      )}
    </DashboardLayout>
  );
}

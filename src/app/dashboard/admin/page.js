import AdminStatsRow from "@/components/dashboard/admin/AdminStatsRow";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Admin Dashboard — TaskBridge",
};

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-2">
        Welcome back
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-6">
        Here&apos;s what&apos;s happening across TaskBridge today.
      </p>
      <AdminStatsRow />
    </DashboardLayout>
  );
}

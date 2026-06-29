import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Client Dashboard — TaskBridge",
};

export default function ClientDashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-2">
        Welcome back
      </h1>
      <p className="text-body text-[var(--color-text-secondary)]">
        Your client dashboard overview is coming in the next step.
      </p>
    </DashboardLayout>
  );
}

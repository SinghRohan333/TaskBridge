"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsRow from "@/components/dashboard/client/StatsRow";
import PostTaskForm from "@/components/dashboard/client/PostTaskForm";

export default function ClientDashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskPosted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Dashboard
      </h1>
      <StatsRow refreshTrigger={refreshTrigger} />
    </DashboardLayout>
  );
}

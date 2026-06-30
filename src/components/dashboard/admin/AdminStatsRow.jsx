"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const statConfig = [
  {
    key: "totalUsers",
    label: "Total Users",
    color: "text-[var(--color-brand-blue)]",
    bg: "bg-[var(--color-blue-tint)]",
  },
  {
    key: "totalTasks",
    label: "Total Tasks",
    color: "text-[var(--color-success-green)]",
    bg: "bg-[var(--color-green-tint)]",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    color: "text-[var(--color-admin-purple)]",
    bg: "bg-[#ede9fe]",
    prefix: "$",
  },
  {
    key: "activeTasks",
    label: "Active Tasks",
    color: "text-[var(--color-warning)]",
    bg: "bg-[#fef3c7]",
  },
];

export default function AdminStatsRow({ refreshTrigger }) {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminEmail = session?.user?.email;
    if (!adminEmail) return;

    setLoading(true);
    apiFetch(`/api/admin/stats?admin_email=${encodeURIComponent(adminEmail)}`)
      .then((data) => setStats(data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [session?.user?.email, refreshTrigger]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statConfig.map((stat) => (
        <div
          key={stat.key}
          className={`${stat.bg} rounded-xl p-4 flex flex-col gap-1`}
        >
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            {stat.label}
          </p>
          {loading ? (
            <div className="h-8 w-16 bg-white/60 rounded animate-pulse" />
          ) : (
            <p className={`text-h2 font-bold ${stat.color}`}>
              {stat.prefix || ""}
              {(stats?.[stat.key] ?? 0).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PlatformStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/stats")
      .then((data) => setStats(data.stats))
      .catch(() => setStats({ totalTasks: 0, totalUsers: 0, totalPayout: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { label: "Tasks Posted", value: stats?.totalTasks },
    { label: "Active Users", value: stats?.totalUsers },
    { label: "Total Payouts", value: stats?.totalPayout, prefix: "$" },
  ];

  return (
    <section className="px-4 md:px-6 py-16 bg-[var(--color-bg-dark)]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <div className="text-hero text-white mb-1">
              {loading ? (
                <span className="inline-block h-10 w-20 bg-[#1f2937] rounded animate-pulse" />
              ) : (
                `${item.prefix || ""}${(item.value ?? 0).toLocaleString()}`
              )}
            </div>
            <p className="text-sm text-[#9ca3af]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

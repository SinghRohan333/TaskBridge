"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

const statConfig = [
  {
    key: "total",
    label: "Total Proposals",
    color: "text-[var(--color-brand-blue)]",
    bg: "bg-[var(--color-blue-tint)]",
  },
  {
    key: "pending",
    label: "Pending",
    color: "text-[#92400e]",
    bg: "bg-[#fef3c7]",
  },
  {
    key: "accepted",
    label: "Accepted",
    color: "text-[var(--color-success-green)]",
    bg: "bg-[var(--color-green-tint)]",
  },
  {
    key: "totalEarnings",
    label: "Total Earnings",
    color: "text-[var(--color-admin-purple)]",
    bg: "bg-[#ede9fe]",
    prefix: "$",
  },
];

const quickLinks = [
  { label: "Browse open tasks", href: "/browse-tasks", desc: "Find new work" },
  {
    label: "My Proposals",
    href: "/dashboard/freelancer/proposals",
    desc: "Track your bids",
  },
  {
    label: "Active Projects",
    href: "/dashboard/freelancer/projects",
    desc: "Ongoing work",
  },
  {
    label: "Earnings",
    href: "/dashboard/freelancer/earnings",
    desc: "Payment history",
  },
];

export default function FreelancerOverviewPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(
      `/api/proposals/freelancer-stats?freelancer_email=${encodeURIComponent(email)}`,
    )
      .then((data) => setStats(data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-1">
        Welcome back, {session?.user?.name?.split(" ")[0] || "there"}
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-8">
        Here is a summary of your activity on TaskBridge.
      </p>

      {/* Stats row */}
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

      {/* Quick links */}
      <h2 className="text-h3 text-[var(--color-text-primary)] mb-4">
        Quick links
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
              {link.label}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {link.desc}
            </p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

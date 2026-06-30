"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { categoryColors } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

const proposalStatusConfig = {
  pending: { label: "Pending", className: "bg-[#fef3c7] text-[#92400e]" },
  accepted: {
    label: "Accepted",
    className: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
  },
};

export default function MyProposalsPage() {
  const { data: session } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(
      `/api/proposals/mine?freelancer_email=${encodeURIComponent(email)}`,
    )
      .then((data) => setProposals(data.proposals))
      .catch(() => toast.error("Failed to load proposals."))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        My Proposals
      </h1>

      <div className="bg-white border border-[#e5e7eb] rounded-xl">
        {loading ? (
          <div className="flex flex-col gap-4 p-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : proposals.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            message="Browse open tasks and submit your first proposal."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    {[
                      "Task",
                      "Category",
                      "Your Bid",
                      "Days",
                      "Submitted",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {proposals.map((p) => {
                    const status =
                      proposalStatusConfig[p.status] ||
                      proposalStatusConfig.pending;
                    const catStyle =
                      categoryColors[p.task_category] || categoryColors.Other;
                    const date = new Date(p.submitted_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    );

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-[#f9fafb] transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-[var(--color-text-primary)] line-clamp-1">
                            {p.task_title}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                          >
                            {p.task_category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[var(--color-success-green)]">
                          ${p.proposed_budget.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {p.estimated_days}d
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {date}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-[#e5e7eb] md:hidden">
              {proposals.map((p) => {
                const status =
                  proposalStatusConfig[p.status] ||
                  proposalStatusConfig.pending;
                const catStyle =
                  categoryColors[p.task_category] || categoryColors.Other;
                const date = new Date(p.submitted_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <div key={p._id} className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[var(--color-text-primary)] flex-1">
                        {p.task_title}
                      </p>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span
                        className={`font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                      >
                        {p.task_category}
                      </span>
                      <span className="font-semibold text-[var(--color-success-green)]">
                        ${p.proposed_budget.toLocaleString()}
                      </span>
                      <span>
                        {p.estimated_days} days · {date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

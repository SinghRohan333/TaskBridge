"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LeaveReviewModal from "./LeaveReviewModal";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

export default function EarningsPage() {
  const { data: session } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewedTaskIds, setReviewedTaskIds] = useState(new Set());
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchData = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    try {
      const [paymentsData] = await Promise.all([
        apiFetch(
          `/api/payments/freelancer?freelancer_email=${encodeURIComponent(email)}`,
        ),
      ]);

      setPayments(paymentsData.payments);

      // Check which tasks already have reviews from this freelancer
      const reviewed = new Set();
      await Promise.all(
        paymentsData.payments.map(async (p) => {
          try {
            const check = await apiFetch(
              `/api/reviews/check?task_id=${p.task_id}&reviewer_email=${encodeURIComponent(email)}`,
            );
            if (check.alreadyReviewed) reviewed.add(p.task_id);
          } catch {
            // silent
          }
        }),
      );
      setReviewedTaskIds(new Set(reviewed));
    } catch {
      toast.error("Failed to load earnings.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleReviewSuccess = () => {
    setSelectedPayment(null);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-[var(--color-text-primary)]">Earnings</h1>
        {payments.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              Total Earned
            </p>
            <p className="text-h2 font-bold text-[var(--color-success-green)]">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-xl">
        {loading ? (
          <div className="flex flex-col gap-4 p-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            title="No earnings yet"
            message="Complete your first project to see your earnings here."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    {["Task", "Client", "Amount", "Date", "Review"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {payments.map((p) => {
                    const date = new Date(p.paid_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    );
                    const hasReviewed = reviewedTaskIds.has(p.task_id);

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-[#f9fafb] transition-colors"
                      >
                        <td className="py-4 px-5">
                          <p className="font-medium text-[var(--color-text-primary)] line-clamp-1">
                            {p.task_title}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-[var(--color-text-secondary)]">
                          {p.client_name}
                        </td>
                        <td className="py-4 px-5 font-semibold text-[var(--color-success-green)]">
                          ${p.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-[var(--color-text-secondary)]">
                          {date}
                        </td>
                        <td className="py-4 px-5">
                          {hasReviewed ? (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-green-tint)] text-[var(--color-green-dark)]">
                              Reviewed
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedPayment(p)}
                              className="text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors"
                            >
                              Leave a review
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-[#e5e7eb] md:hidden">
              {payments.map((p) => {
                const date = new Date(p.paid_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const hasReviewed = reviewedTaskIds.has(p.task_id);

                return (
                  <div key={p._id} className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[var(--color-text-primary)] flex-1">
                        {p.task_title}
                      </p>
                      <span className="font-semibold text-[var(--color-success-green)] flex-shrink-0">
                        ${p.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {p.client_name} · {date}
                      </p>
                      {hasReviewed ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-green-tint)] text-[var(--color-green-dark)]">
                          Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors"
                        >
                          Rate client
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <LeaveReviewModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onSuccess={handleReviewSuccess}
      />
    </DashboardLayout>
  );
}

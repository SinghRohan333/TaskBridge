"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function ClientPaymentsPage() {
  const { data: session } = authClient.useSession();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(`/api/payments/client?client_email=${encodeURIComponent(email)}`)
      .then((data) => setPayments(data.payments))
      .catch(() => toast.error("Failed to load payment history."))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-[var(--color-text-primary)]">
          Payment History
        </h1>
        {payments.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              Total Spent
            </p>
            <p className="text-h2 font-bold text-[var(--color-success-green)]">
              ${totalSpent.toLocaleString()}
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
            title="No payments yet"
            message="Your payment history will appear here after you hire a freelancer."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Task
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Freelancer
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {payments.map((payment) => {
                    const date = new Date(payment.paid_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    );

                    return (
                      <tr
                        key={payment._id}
                        className="hover:bg-[#f9fafb] transition-colors"
                      >
                        <td className="py-4 px-5">
                          <p className="font-medium text-[var(--color-text-primary)] line-clamp-1">
                            {payment.task_title}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-[var(--color-text-secondary)]">
                          {payment.freelancer_name}
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-[var(--color-success-green)]">
                            ${payment.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[var(--color-text-secondary)]">
                          {date}
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-green-tint)] text-[var(--color-green-dark)]">
                            Succeeded
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="flex flex-col divide-y divide-[#e5e7eb] md:hidden">
              {payments.map((payment) => {
                const date = new Date(payment.paid_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <div
                    key={payment._id}
                    className="px-4 py-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[var(--color-text-primary)] flex-1">
                        {payment.task_title}
                      </p>
                      <span className="font-semibold text-[var(--color-success-green)] flex-shrink-0">
                        ${payment.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {payment.freelancer_name} · {date}
                      </p>
                      <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-green-tint)] text-[var(--color-green-dark)]">
                        Succeeded
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

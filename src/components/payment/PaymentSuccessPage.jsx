"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!session_id) {
      setError(true);
      setLoading(false);
      return;
    }

    apiFetch(
      `/api/stripe/confirm-session?session_id=${encodeURIComponent(session_id)}`,
    )
      .then((data) => setSummary(data.summary))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [session_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-[var(--color-text-secondary)]">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-[var(--color-danger)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-h2 text-[var(--color-text-primary)] mb-2">
            Something went wrong
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] mb-6">
            We could not confirm your payment. Please check your proposals page
            or contact support.
          </p>
          <button
            onClick={() => router.push("/dashboard/client/proposals")}
            className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Go to Proposals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-green-tint)] flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-[var(--color-success-green)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-h1 text-[var(--color-text-primary)] mb-2">
          Payment successful
        </h1>
        <p className="text-body text-[var(--color-text-secondary)] mb-6">
          Your payment has been confirmed and the freelancer has been notified.
        </p>

        {/* Summary card */}
        <div className="bg-[var(--color-bg)] rounded-xl p-5 mb-6 text-left flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Task
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)] text-right">
              {summary.taskTitle}
            </span>
          </div>
          <div className="border-t border-[#e5e7eb]" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Freelancer
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {summary.freelancerName}
            </span>
          </div>
          <div className="border-t border-[#e5e7eb]" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Amount paid
            </span>
            <span className="text-lg font-bold text-[var(--color-success-green)]">
              ${summary.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard/client")}
          className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

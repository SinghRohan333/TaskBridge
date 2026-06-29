"use client";

import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Link from "next/link";

const categoryColors = {
  Design: "bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)]",
  Writing: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  Development: "bg-[#ede9fe] text-[var(--color-admin-purple)]",
  Marketing: "bg-[#fef3c7] text-[#92400e]",
  Other: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
};

const initialForm = {
  proposed_budget: "",
  estimated_days: "",
  cover_note: "",
};

export default function TaskDetailPage({ params }) {
  const { id } = use(params);

  const { data: sessionData, isPending: sessionLoading } =
    authClient.useSession();

  const user = sessionData?.user || null;
  const isFreelancer = user?.role === "freelancer";

  const [task, setTask] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch task details
  useEffect(() => {
    if (!id) return;

    setTaskLoading(true);
    apiFetch(`/api/tasks/${id}`)
      .then((data) => setTask(data.task))
      .catch(() => toast.error("Failed to load task details."))
      .finally(() => setTaskLoading(false));
  }, [id]);

  // Check if freelancer already applied
  useEffect(() => {
    if (!id || !user?.email || !isFreelancer) return;

    apiFetch(
      `/api/proposals/check?task_id=${id}&freelancer_email=${encodeURIComponent(user.email)}`,
    )
      .then((data) => setAlreadyApplied(data.alreadyApplied))
      .catch(() => {
        // silent fail — worst case they see the form and get a 409 on submit
      });
  }, [id, user?.email, isFreelancer]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const newErrors = {};

    const budget = parseFloat(form.proposed_budget);
    if (!form.proposed_budget || isNaN(budget) || budget <= 0) {
      newErrors.proposed_budget = "Enter a valid budget amount.";
    }

    const days = parseInt(form.estimated_days, 10);
    if (!form.estimated_days || isNaN(days) || days <= 0) {
      newErrors.estimated_days = "Enter a valid number of days.";
    }

    if (!form.cover_note.trim() || form.cover_note.trim().length < 20) {
      newErrors.cover_note = "Cover note must be at least 20 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: id,
          freelancer_email: user.email,
          proposed_budget: parseFloat(form.proposed_budget),
          estimated_days: parseInt(form.estimated_days, 10),
          cover_note: form.cover_note.trim(),
        }),
      });

      toast.success("Proposal submitted successfully!");
      setAlreadyApplied(true);
      setForm(initialForm);
    } catch (err) {
      toast.error(err.message || "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  }

  // Format deadline
  const deadline = task
    ? new Date(task.deadline).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const categoryStyle = task
    ? categoryColors[task.category] || categoryColors.Other
    : "";

  // Loading state
  if (taskLoading || sessionLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div>
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  // Task not found
  if (!task) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 text-center">
        <p className="text-h2 text-[var(--color-text-primary)] mb-2">
          Task not found
        </p>
        <p className="text-body text-[var(--color-text-secondary)]">
          This task may have been removed or does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Task Details (takes 2/3 on desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 md:p-8">
            {/* Category pill */}
            <span
              className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle} mb-4`}
            >
              {task.category}
            </span>

            {/* Title */}
            <h1 className="text-h1 text-[var(--color-text-primary)] mb-2">
              {task.title}
            </h1>

            {/* Posted by */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Posted by{" "}
              <span className="font-medium text-[var(--color-text-primary)]">
                {task.client_name}
              </span>
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-caption text-[var(--color-text-secondary)] uppercase">
                  Budget
                </span>
                <span className="text-h3 text-[var(--color-success-green)] font-semibold">
                  ${task.budget}
                </span>
              </div>
              <div className="w-px bg-[#e5e7eb] hidden sm:block" />
              <div className="flex flex-col gap-0.5">
                <span className="text-caption text-[var(--color-text-secondary)] uppercase">
                  Deadline
                </span>
                <span className="text-h3 text-[var(--color-text-primary)]">
                  {deadline}
                </span>
              </div>
              <div className="w-px bg-[#e5e7eb] hidden sm:block" />
              <div className="flex flex-col gap-0.5">
                <span className="text-caption text-[var(--color-text-secondary)] uppercase">
                  Status
                </span>
                <span
                  className={`text-sm font-semibold capitalize ${
                    task.status === "open"
                      ? "text-[var(--color-success-green)]"
                      : task.status === "in-progress"
                        ? "text-[var(--color-brand-blue)]"
                        : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#e5e7eb] mb-6" />

            {/* Description */}
            <div>
              <h2 className="text-h3 text-[var(--color-text-primary)] mb-3">
                Task Description
              </h2>
              <p className="text-body text-[var(--color-text-secondary)] whitespace-pre-line">
                {task.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right — Proposal Panel (takes 1/3 on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 sticky top-24">
            {/* Case 1: not logged in */}
            {!user && (
              <div className="text-center">
                <p className="text-h3 text-[var(--color-text-primary)] mb-2">
                  Want this task?
                </p>
                <p className="text-body text-[var(--color-text-secondary)] mb-4">
                  Log in as a freelancer to submit a proposal.
                </p>

                <Link
                  href="/login"
                  className="block w-full text-center bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Log in
                </Link>
              </div>
            )}

            {/* Case 2: logged in as client or admin */}
            {user && !isFreelancer && (
              <div className="text-center">
                <p className="text-body text-[var(--color-text-secondary)]">
                  Only freelancers can submit proposals.
                </p>
              </div>
            )}

            {/* Case 3: freelancer, already applied */}
            {isFreelancer && alreadyApplied && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-green-tint)] flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-[var(--color-success-green)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-h3 text-[var(--color-text-primary)] mb-1">
                  Proposal submitted
                </p>
                <p className="text-body text-[var(--color-text-secondary)]">
                  You have already applied to this task. We will notify you when
                  the client responds.
                </p>
              </div>
            )}

            {/* Case 4: freelancer, not yet applied, task is open */}
            {isFreelancer && !alreadyApplied && task.status === "open" && (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-h3 text-[var(--color-text-primary)] mb-5">
                  Submit a Proposal
                </h2>

                {/* Proposed Budget */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Your bid (USD)
                  </label>
                  <input
                    type="number"
                    name="proposed_budget"
                    value={form.proposed_budget}
                    onChange={handleChange}
                    min="1"
                    placeholder={`Task budget: $${task.budget}`}
                    className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition"
                  />
                  {errors.proposed_budget && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.proposed_budget}
                    </p>
                  )}
                </div>

                {/* Estimated Days */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Estimated days to complete
                  </label>
                  <input
                    type="number"
                    name="estimated_days"
                    value={form.estimated_days}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 3"
                    className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition"
                  />
                  {errors.estimated_days && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.estimated_days}
                    </p>
                  )}
                </div>

                {/* Cover Note */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Cover note
                  </label>
                  <textarea
                    name="cover_note"
                    value={form.cover_note}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Briefly explain why you are the right person for this task..."
                    className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition resize-none"
                  />
                  {errors.cover_note && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.cover_note}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </form>
            )}

            {/* Case 5: freelancer, task is no longer open */}
            {isFreelancer && !alreadyApplied && task.status !== "open" && (
              <div className="text-center">
                <p className="text-body text-[var(--color-text-secondary)]">
                  This task is no longer accepting proposals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

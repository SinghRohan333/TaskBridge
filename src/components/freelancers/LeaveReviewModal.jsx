"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Xmark } from "@gravity-ui/icons";
import StarRating from "@/components/ui/StarRating";

export default function LeaveReviewModal({ payment, onClose, onSuccess }) {
  const { data: session } = authClient.useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: payment.task_id,
          reviewer_email: session?.user?.email,
          reviewee_email: payment.client_email,
          rating,
          comment: comment.trim(),
        }),
      });

      toast.success("Review submitted successfully.");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {payment && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                <h2 className="text-h3 text-[var(--color-text-primary)]">
                  Rate this client
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <Xmark width={20} height={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-6 py-5 flex flex-col gap-4"
              >
                <p className="text-sm text-[var(--color-text-secondary)]">
                  How was working with{" "}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {payment.client_name}
                  </span>{" "}
                  on{" "}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {payment.task_title}
                  </span>
                  ?
                </p>

                {/* Interactive star selector */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          setError("");
                        }}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <span
                          className={
                            star <= rating ? "text-[#f59e0b]" : "text-[#e5e7eb]"
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  {error && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience working with this client..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

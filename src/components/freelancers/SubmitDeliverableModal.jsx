"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Xmark } from "@gravity-ui/icons";

export default function SubmitDeliverableModal({ task, onClose, onSuccess }) {
  const { data: session } = authClient.useSession();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Deliverable URL is required.");
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError("Enter a valid URL.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch(`/api/tasks/${task._id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancer_email: session?.user?.email,
          deliverable_url: url.trim(),
        }),
      });

      toast.success("Deliverable submitted. Task marked as completed.");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to submit deliverable.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition";

  return (
    <AnimatePresence>
      {task && (
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
                  Submit Deliverable
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
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Submitting deliverable for:{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {task.title}
                    </span>
                  </p>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Deliverable URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    placeholder="https://github.com/yourrepo or https://docs.google.com/..."
                    className={inputClass}
                  />
                  {error && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                    Link to your GitHub repo, Google Drive, Figma file, or any
                    shareable URL.
                  </p>
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
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-success-green)] hover:bg-[var(--color-green-dark)] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit"}
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

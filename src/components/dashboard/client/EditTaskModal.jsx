"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Xmark } from "@gravity-ui/icons";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

function validate(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  } else if (form.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters.";
  }

  if (!form.category) {
    errors.category = "Please select a category.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  } else if (form.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }

  const budget = parseFloat(form.budget);
  if (!form.budget || isNaN(budget) || budget <= 0) {
    errors.budget = "Enter a valid budget amount.";
  }

  if (!form.deadline) {
    errors.deadline = "Deadline is required.";
  }

  return errors;
}

export default function EditTaskModal({ task, onClose, onSuccess }) {
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form when task changes
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        category: task.category,
        description: task.description,
        budget: String(task.budget),
        deadline: task.deadline?.split("T")[0] || task.deadline || "",
      });
      setErrors({});
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_email: session?.user?.email,
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          budget: parseFloat(form.budget),
          deadline: form.deadline,
        }),
      });

      toast.success("Task updated successfully!");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to update task.");
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
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                <h2 className="text-h3 text-[var(--color-text-primary)]">
                  Edit Task
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <Xmark width={20} height={20} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-6 py-5 flex flex-col gap-4"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.title && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.description && (
                    <p className="text-xs text-[var(--color-danger)] mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Budget + Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Budget (USD)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      min="1"
                      className={inputClass}
                    />
                    {errors.budget && (
                      <p className="text-xs text-[var(--color-danger)] mt-1">
                        {errors.budget}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {errors.deadline && (
                      <p className="text-xs text-[var(--color-danger)] mt-1">
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
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

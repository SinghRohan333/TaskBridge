"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

const initialForm = {
  title: "",
  category: "",
  description: "",
  budget: "",
  deadline: "",
};

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
  } else if (new Date(form.deadline) <= new Date()) {
    errors.deadline = "Deadline must be a future date.";
  }

  return errors;
}

export default function PostTaskForm({ onSuccess }) {
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

    const client_email = session?.user?.email;
    if (!client_email) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          budget: parseFloat(form.budget),
          deadline: form.deadline,
          client_email,
        }),
      });

      toast.success("Task posted successfully!");
      setForm(initialForm);
      setErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to post task.");
    } finally {
      setSubmitting(false);
    }
  };

  // Compute today's date in yyyy-mm-dd format for the min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  const inputClass =
    "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition";

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <h2 className="text-h2 text-[var(--color-text-primary)] mb-6">
        Post a New Task
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
            placeholder="e.g. Design a logo for my coffee shop"
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
            rows={5}
            placeholder="Describe exactly what you need done, including any requirements or preferences..."
            className={`${inputClass} resize-none`}
          />
          {errors.description && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Budget + Deadline row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              placeholder="e.g. 150"
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
              min={todayStr}
              className={inputClass}
            />
            {errors.deadline && (
              <p className="text-xs text-[var(--color-danger)] mt-1">
                {errors.deadline}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto sm:self-end bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-colors"
        >
          {submitting ? "Posting..." : "Post Task"}
        </button>
      </form>
    </div>
  );
}

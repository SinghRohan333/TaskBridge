"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

const inputClass =
  "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition";

const readOnlyClass =
  "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-secondary)] bg-[#f9fafb] cursor-not-allowed";

export default function ClientProfilePage() {
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({ name: "", image: "" });
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const user = session?.user;
    if (!user) return;

    setForm({
      name: user.name || "",
      image: user.image || "",
    });
  }, [session?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setImgError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          image: form.image.trim(),
        }),
      });

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const showPreview = form.image && !imgError;
  const user = session?.user;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Edit Profile
      </h1>

      <div className="max-w-2xl">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              {showPreview ? (
                <img
                  src={form.image}
                  alt="Profile preview"
                  onError={() => setImgError(true)}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  {form.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={readOnlyClass}
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                Your email is tied to your account login and cannot be changed
                here.
              </p>
            </div>

            {/* Account info row */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e5e7eb]">
              <div className="pt-4">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                  Account Type
                </p>
                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)] capitalize">
                  {user?.role || "client"}
                </span>
              </div>
              <div className="pt-4">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                  Member Since
                </p>
                <p className="text-sm text-[var(--color-text-primary)]">
                  {memberSince}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-colors"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

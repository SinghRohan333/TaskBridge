"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Xmark } from "@gravity-ui/icons";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const inputClass =
  "w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition";

export default function EditProfilePage() {
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    name: "",
    image: "",
    bio: "",
    hourlyRate: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Pre-fill from session
  useEffect(() => {
    const user = session?.user;
    if (!user) return;

    setForm({
      name: user.name || "",
      image: user.image || "",
      bio: user.bio || "",
      hourlyRate: user.hourlyRate ? String(user.hourlyRate) : "",
    });
    setSkills(user.skills || []);
  }, [session?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setImgError(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = skillInput.trim();
      if (skill && !skills.includes(skill) && skills.length < 15) {
        setSkills((prev) => [...prev, skill]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    const hourlyRate = parseFloat(form.hourlyRate);
    if (form.hourlyRate && (isNaN(hourlyRate) || hourlyRate < 0)) {
      toast.error("Enter a valid hourly rate.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: form.name.trim(),
          image: form.image.trim(),
          bio: form.bio.trim(),
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
          skills,
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

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell clients about your experience, specialties, and what makes you stand out..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Hourly rate */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Hourly Rate (USD)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 25"
                className={inputClass}
              />
            </div>

            {/* Skills tag input */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Skills
              </label>
              <div className="border border-[#e5e7eb] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-brand-blue)] focus-within:border-transparent transition">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)] px-2.5 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-[var(--color-danger)] transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <Xmark width={12} height={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={
                    skills.length === 0
                      ? "Type a skill and press Enter..."
                      : "Add more..."
                  }
                  className="w-full text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none bg-transparent"
                />
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Press Enter or comma to add a skill. Maximum 15 skills.
              </p>
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

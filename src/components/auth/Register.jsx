"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthCard from "@/components/AuthCard";
import GoogleButton from "@/components/GoogleButton";
import { authClient } from "@/lib/auth-client";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateImageUrl,
  validateRole,
} from "@/lib/validators";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "client",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      image: validateImageUrl(form.image),
      role: validateRole(form.role),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    await authClient.signUp.email(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image || undefined,
        role: form.role,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          if (form.role === "freelancer") {
            router.push("/dashboard/freelancer");
          } else {
            router.push("/dashboard/client");
          }
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Something went wrong. Please try again.",
          );
        },
      },
    );

    setLoading(false);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join TaskBridge as a client or freelancer"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
            placeholder="Jane Doe"
          />
          {errors.name && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
            placeholder="jane@example.com"
          />
          {errors.email && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Image URL{" "}
            <span className="text-[var(--color-text-secondary)]">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={form.image}
            onChange={handleChange("image")}
            className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
            placeholder="https://example.com/photo.jpg"
          />
          {errors.image && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.image}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            className="w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            I want to
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
              <input
                type="radio"
                name="role"
                value="client"
                checked={form.role === "client"}
                onChange={handleChange("role")}
              />
              Hire freelancers
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={form.role === "freelancer"}
                onChange={handleChange("role")}
              />
              Work as a freelancer
            </label>
          </div>
          {errors.role && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              {errors.role}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white rounded-md py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-xs text-[var(--color-text-secondary)]">OR</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>

        <GoogleButton label="Sign up with Google" />
      </form>
    </AuthCard>
  );
}

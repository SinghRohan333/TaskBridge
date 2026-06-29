"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthCard from "@/components/AuthCard";
import GoogleButton from "@/components/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { validateEmail } from "@/lib/validators";

const roleRedirects = {
  client: "/",
  freelancer: "/dashboard/freelancer",
  admin: "/dashboard/admin",
};

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: form.password ? null : "Password is required.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    await authClient.signIn.email(
      { email: form.email, password: form.password },
      {
        onSuccess: ({ data }) => {
          toast.success("Welcome to TaskBridge");
          const role = data?.user?.role || "client";
          router.push(roleRedirects[role] || "/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid email or password.");
        },
      },
    );

    setLoading(false);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your TaskBridge account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white rounded-md py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-xs text-[var(--color-text-secondary)]">OR</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>

        <GoogleButton label="Continue with Google" />
      </form>
    </AuthCard>
  );
}

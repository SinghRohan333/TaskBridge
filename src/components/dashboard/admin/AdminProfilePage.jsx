"use client";

import { authClient } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Account Info
      </h1>

      <div className="max-w-2xl">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
          {/* Identity header */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#e5e7eb]">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-admin-purple)] text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-h3 text-[var(--color-text-primary)]">
                  {user?.name || "Admin"}
                </p>
                <VerifiedBadge size={16} />
              </div>
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#ede9fe] text-[var(--color-admin-purple)] mt-1 capitalize">
                {user?.role || "admin"}
              </span>
            </div>
          </div>

          {/* Read-only info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm text-[var(--color-text-primary)]">
                {user?.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Member Since
              </p>
              <p className="text-sm text-[var(--color-text-primary)]">
                {memberSince}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#e5e7eb]">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Admin account details are managed at the database level and cannot
              be edited from this dashboard for security reasons.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { Xmark } from "@gravity-ui/icons";
import { clearAuthToken } from "@/lib/auth-token";

const navLinks = {
  client: [
    { label: "Overview", href: "/dashboard/client" },
    { label: "Post a Task", href: "/dashboard/client/post-task" },
    { label: "My Tasks", href: "/dashboard/client/my-tasks" },
    { label: "My Proposals", href: "/dashboard/client/proposals" },
    { label: "Payment History", href: "/dashboard/client/payments" },
    { label: "Edit Profile", href: "/dashboard/client/profile" },
  ],
  freelancer: [
    { label: "Overview", href: "/dashboard/freelancer" },
    { label: "Browse Tasks", href: "/browse-tasks" },
    { label: "My Proposals", href: "/dashboard/freelancer/proposals" },
    { label: "Active Projects", href: "/dashboard/freelancer/projects" },
    { label: "Earnings", href: "/dashboard/freelancer/earnings" },
    { label: "Edit Profile", href: "/dashboard/freelancer/profile" },
    { label: "Bookmarked Tasks", href: "/dashboard/freelancer/bookmarks" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Manage Tasks", href: "/dashboard/admin/tasks" },
    { label: "Manage Payments", href: "/dashboard/admin/payments" },
    { label: "Edit Profile", href: "/dashboard/admin/profile" },
  ],
};

export default function DashboardSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const user = session?.user || null;
  const role = user?.role || "client";
  const links = navLinks[role] || navLinks.client;

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          clearAuthToken();
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-[#e5e7eb] w-64">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex items-center justify-between px-5 pt-5 pb-2 md:hidden">
          <span className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Xmark width={20} height={20} />
          </button>
        </div>
      )}

      {/* User info */}
      <div className="px-5 py-6 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {getInitials(user?.name || "")}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {user?.name || "User"}
              </p>
              {user?.isVerified && <VerifiedBadge size={13} />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] capitalize">
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[var(--color-blue-tint)] text-[var(--color-brand-blue)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[#f3f4f6] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#e5e7eb]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-danger)] hover:bg-[#fef2f2] transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

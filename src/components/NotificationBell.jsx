"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Bell } from "@gravity-ui/icons";

export default function NotificationBell() {
  const { data: session } = authClient.useSession();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const shouldPoll = session?.user?.role === "freelancer";

  useEffect(() => {
    if (!shouldPoll) return;
    const fetchNotifications = () => {
      apiFetch("/api/notifications/mine")
        .then((data) => setNotifications(data.notifications || []))
        .catch(() => {});
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [shouldPoll]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && notifications.length > 0) {
      try {
        await apiFetch("/api/notifications/read", { method: "PATCH" });
        setNotifications([]);
      } catch {}
    }
  };

  if (!shouldPoll) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <Bell width={20} height={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--color-danger)] rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-[#e5e7eb] rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#e5e7eb]">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              Notifications
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--color-text-secondary)] text-center">
                No new notifications.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="px-4 py-3 border-b border-[#e5e7eb] last:border-0"
                >
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {n.message}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

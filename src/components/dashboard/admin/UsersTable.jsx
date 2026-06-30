"use client";

import { useState } from "react";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const roleStyles = {
  client: "bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)]",
  freelancer: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  admin: "bg-[#ede9fe] text-[var(--color-admin-purple)]",
};

export default function UsersTable({ users, onBlock, onUnblock, onVerify }) {
  const [confirmAction, setConfirmAction] = useState(null);

  const askConfirm = (type, user) => setConfirmAction({ type, user });
  const closeConfirm = () => setConfirmAction(null);

  const runConfirmed = () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    if (type === "block") onBlock(user);
    if (type === "unblock") onUnblock(user);
    closeConfirm();
  };

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Email
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Role
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-[#f9fafb] transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {user.name}
                    </p>
                    {user.isVerified && <VerifiedBadge size={13} />}
                  </div>
                </td>
                <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                  {user.email}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      roleStyles[user.role] || roleStyles.client
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.isBlocked
                        ? "bg-[#fef2f2] text-[var(--color-danger)]"
                        : "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {user.role === "freelancer" && !user.isVerified && (
                      <button
                        onClick={() => onVerify(user)}
                        className="text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--color-blue-tint)]"
                      >
                        Verify
                      </button>
                    )}
                    {user.role !== "admin" &&
                      (user.isBlocked ? (
                        <button
                          onClick={() => askConfirm("unblock", user)}
                          className="text-xs font-semibold text-[var(--color-success-green)] hover:text-[var(--color-green-dark)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--color-green-tint)]"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => askConfirm("block", user)}
                          className="text-xs font-semibold text-[var(--color-danger)] hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#fef2f2]"
                        >
                          Block
                        </button>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-medium text-[var(--color-text-primary)] truncate">
                  {user.name}
                </p>
                {user.isVerified && <VerifiedBadge size={13} />}
              </div>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                  user.isBlocked
                    ? "bg-[#fef2f2] text-[var(--color-danger)]"
                    : "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {user.email}
            </p>

            <span
              className={`inline-block w-fit text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                roleStyles[user.role] || roleStyles.client
              }`}
            >
              {user.role}
            </span>

            <div className="flex gap-2 pt-1 border-t border-[#e5e7eb] flex-wrap">
              {user.role === "freelancer" && !user.isVerified && (
                <button
                  onClick={() => onVerify(user)}
                  className="flex-1 text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] py-1.5 rounded-lg hover:bg-[var(--color-blue-tint)] transition-colors"
                >
                  Verify
                </button>
              )}
              {user.role !== "admin" &&
                (user.isBlocked ? (
                  <button
                    onClick={() => askConfirm("unblock", user)}
                    className="flex-1 text-xs font-semibold text-[var(--color-success-green)] py-1.5 rounded-lg hover:bg-[var(--color-green-tint)] transition-colors"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => askConfirm("block", user)}
                    className="flex-1 text-xs font-semibold text-[var(--color-danger)] py-1.5 rounded-lg hover:bg-[#fef2f2] transition-colors"
                  >
                    Block
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === "block"
            ? "Block this user?"
            : "Unblock this user?"
        }
        message={
          confirmAction?.type === "block"
            ? `${confirmAction?.user?.name} will immediately lose login access to TaskBridge.`
            : `${confirmAction?.user?.name} will be able to log in again.`
        }
        confirmLabel={confirmAction?.type === "block" ? "Block" : "Unblock"}
        danger={confirmAction?.type === "block"}
        onConfirm={runConfirmed}
        onCancel={closeConfirm}
      />
    </>
  );
}

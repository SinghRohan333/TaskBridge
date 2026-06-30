"use client";

import { useState } from "react";
import { categoryColors } from "@/lib/utils";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const statusConfig = {
  open: {
    label: "Open",
    className: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-[#fef3c7] text-[#92400e]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
  },
};

export default function AdminTasksTable({ tasks, onDelete }) {
  const [taskToDelete, setTaskToDelete] = useState(null);

  const confirmDelete = () => {
    if (taskToDelete) onDelete(taskToDelete);
    setTaskToDelete(null);
  };

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Title
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Category
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Budget
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
            {tasks.map((task) => {
              const status = statusConfig[task.status] || statusConfig.open;
              const catStyle =
                categoryColors[task.category] || categoryColors.Other;
              return (
                <tr
                  key={task._id}
                  className="hover:bg-[#f9fafb] transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-[var(--color-text-primary)] line-clamp-1">
                      {task.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {task.client_email}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                    >
                      {task.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[var(--color-success-green)]">
                      ${task.budget.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="text-xs font-semibold text-[var(--color-danger)] hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#fef2f2]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {tasks.map((task) => {
          const status = statusConfig[task.status] || statusConfig.open;
          const catStyle =
            categoryColors[task.category] || categoryColors.Other;
          return (
            <div
              key={task._id}
              className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-[var(--color-text-primary)] flex-1">
                  {task.title}
                </p>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
                <span
                  className={`inline-block font-medium px-2.5 py-1 rounded-full ${catStyle}`}
                >
                  {task.category}
                </span>
                <span className="font-semibold text-[var(--color-success-green)]">
                  ${task.budget.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {task.client_email}
              </p>
              <button
                onClick={() => setTaskToDelete(task)}
                className="text-xs font-semibold text-[var(--color-danger)] py-1.5 rounded-lg hover:bg-[#fef2f2] transition-colors border-t border-[#e5e7eb] pt-3"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete this task?"
        message={`"${taskToDelete?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}

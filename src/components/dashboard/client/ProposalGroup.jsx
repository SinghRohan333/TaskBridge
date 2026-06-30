import { useState } from "react";
import { getInitials, categoryColors } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-[#fef3c7] text-[#92400e]",
  },
  accepted: {
    label: "Accepted",
    className: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
  },
};

const taskStatusConfig = {
  open: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  "in-progress": "bg-[#fef3c7] text-[#92400e]",
  completed: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
};

export default function ProposalGroup({ group, onAccept, onReject }) {
  const { task, proposals } = group;

  const hasAccepted = proposals.some((p) => p.status === "accepted");
  const catStyle = categoryColors[task.category] || categoryColors.Other;
  const taskStatusStyle =
    taskStatusConfig[task.status] || taskStatusConfig.open;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
      {/* Task header */}
      <div className="px-5 py-4 border-b border-[#e5e7eb] flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-h3 text-[var(--color-text-primary)] truncate">
            {task.title}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${catStyle}`}
          >
            {task.category}
          </span>
          <span className="text-sm font-semibold text-[var(--color-success-green)]">
            ${task.budget.toLocaleString()}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${taskStatusStyle}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Proposals list */}
      <div className="divide-y divide-[#e5e7eb]">
        {proposals.map((proposal) => {
          const status = statusConfig[proposal.status] || statusConfig.pending;
          const isPending = proposal.status === "pending";
          const isAccepted = proposal.status === "accepted";

          return (
            <div
              key={proposal._id}
              className={`px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors ${
                isAccepted ? "bg-[var(--color-green-tint)]/30" : ""
              }`}
            >
              {/* Freelancer avatar + name */}
              <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                {proposal.freelancer_image ? (
                  <img
                    src={proposal.freelancer_image}
                    alt={proposal.freelancer_name}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {getInitials(proposal.freelancer_name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {proposal.freelancer_name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {proposal.estimated_days} day
                    {proposal.estimated_days !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Bid + cover note */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-success-green)] mb-1">
                  ${proposal.proposed_budget.toLocaleString()} bid
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {proposal.cover_note}
                </p>
              </div>

              {/* Actions / status */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                {!isPending ? (
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => onAccept(proposal, task)}
                      disabled={hasAccepted}
                      className="text-xs font-semibold text-white bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onReject(proposal)}
                      className="text-xs font-semibold text-[var(--color-danger)] hover:text-red-700 border border-[var(--color-danger)] hover:border-red-700 px-4 py-1.5 rounded-lg hover:bg-[#fef2f2] transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

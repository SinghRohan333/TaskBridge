"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProposalGroup from "@/components/dashboard/client/ProposalGroup";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

export default function ClientProposalsPage() {
  const { data: session } = authClient.useSession();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchGroups = useCallback(() => {
    const email = session?.user?.email;
    if (!email) return;

    setLoading(true);
    apiFetch(`/api/proposals/client?client_email=${encodeURIComponent(email)}`)
      .then((data) => setGroups(data.groups))
      .catch(() => toast.error("Failed to load proposals."))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleAccept = async (proposal, task) => {
    setAcceptingId(proposal._id);
    try {
      const data = await apiFetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: proposal._id,
          task_id: task._id,
          client_email: session?.user?.email,
        }),
      });

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment.");
      setAcceptingId(null);
    }
  };

  const handleReject = async (proposal) => {
    try {
      await apiFetch(`/api/proposals/${proposal._id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_email: session?.user?.email }),
      });

      toast.success("Proposal rejected.");

      // Optimistic update — change status in local state without refetch
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          proposals: group.proposals.map((p) =>
            p._id === proposal._id ? { ...p, status: "rejected" } : p,
          ),
        })),
      );
    } catch (err) {
      toast.error(err.message || "Failed to reject proposal.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        My Proposals
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="No proposals yet"
          message="Once freelancers apply to your tasks, their proposals will appear here."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <ProposalGroup
              key={group.task._id}
              group={group}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

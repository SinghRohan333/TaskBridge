"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TransactionsTable from "@/components/dashboard/admin/TransactionsTable";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function TransactionsPage() {
  const { data: session } = authClient.useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminEmail = session?.user?.email;

  useEffect(() => {
    if (!adminEmail) return;
    setLoading(true);
    apiFetch(
      `/api/admin/transactions?admin_email=${encodeURIComponent(adminEmail)}`,
    )
      .then((data) => setTransactions(data.transactions))
      .catch(() => toast.error("Failed to load transactions."))
      .finally(() => setLoading(false));
  }, [adminEmail]);

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Transactions
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          message="Successful payments will appear here."
        />
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import FreelancerCard from "@/components/home/FreelancerCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { apiFetch } from "@/lib/api";

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/users/freelancers")
      .then((data) => setFreelancers(data.freelancers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-8">
        Browse Freelancers
      </h1>

      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

      {!loading && !error && freelancers.length === 0 ? (
        <EmptyState
          title="No freelancers yet"
          message="Check back soon as more freelancers join TaskBridge."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : freelancers.map((f) => (
                <FreelancerCard key={f._id} freelancer={f} />
              ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import FreelancerCard from "./FreelancerCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { apiFetch } from "@/lib/api";

export default function TopFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/users/freelancers/top")
      .then((data) => setFreelancers(data.freelancers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 md:px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-h1 text-[var(--color-text-primary)] mb-8">
          Top Freelancers
        </h2>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : freelancers.map((f) => (
                <FreelancerCard key={f._id} freelancer={f} />
              ))}
        </div>

        {!loading && freelancers.length === 0 && !error && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No freelancers yet — be the first to join!
          </p>
        )}
      </div>
    </section>
  );
}

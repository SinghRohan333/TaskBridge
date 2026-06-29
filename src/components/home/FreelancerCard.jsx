"use client";

import Link from "next/link";
import { useState } from "react";
import StarRating from "@/components/ui/StarRating";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FreelancerCard({ freelancer }) {
  const [imgError, setImgError] = useState(false);
  const showImage = freelancer.image && !imgError;

  return (
    <Link
      href={`/browse-freelancers/${freelancer._id}`}
      className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
    >
      {showImage ? (
        <img
          src={freelancer.image}
          alt={freelancer.name}
          onError={() => setImgError(true)}
          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-lg font-semibold mx-auto mb-3">
          {getInitials(freelancer.name)}
        </div>
      )}

      <h3 className="text-h3 text-[var(--color-text-primary)] mb-1">
        {freelancer.name}
      </h3>

      <div className="flex justify-center mb-2">
        <StarRating rating={freelancer.averageRating || 0} size={14} />
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {(freelancer.skills || []).slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)] px-2 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-xs text-[var(--color-text-secondary)]">
        {freelancer.completedJobsCount || 0} jobs completed
      </p>
    </Link>
  );
}

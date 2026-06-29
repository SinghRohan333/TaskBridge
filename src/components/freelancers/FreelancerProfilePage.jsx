"use client";

import { use, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import StarRating from "@/components/ui/StarRating";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import ReviewsList from "./ReviewsList";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FreelancerProfilePage({ params }) {
  const { id } = use(params);

  const [freelancer, setFreelancer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setProfileLoading(true);
    apiFetch(`/api/users/freelancers/${id}`)
      .then((data) => setFreelancer(data.freelancer))
      .catch(() => setFreelancer(null))
      .finally(() => setProfileLoading(false));
  }, [id]);

  useEffect(() => {
    if (!freelancer?.email) return;
    setReviewsLoading(true);
    apiFetch(
      `/api/reviews?reviewee_email=${encodeURIComponent(freelancer.email)}`,
    )
      .then((data) => setReviews(data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [freelancer?.email]);

  if (profileLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SkeletonCard />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 text-center">
        <p className="text-h2 text-[var(--color-text-primary)] mb-2">
          Freelancer not found
        </p>
        <p className="text-body text-[var(--color-text-secondary)]">
          This profile may have been removed or does not exist.
        </p>
      </div>
    );
  }

  const showImage = freelancer.image && !imgError;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Profile summary card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 text-center sticky top-24">
            {showImage ? (
              <img
                src={freelancer.image}
                alt={freelancer.name}
                onError={() => setImgError(true)}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                {getInitials(freelancer.name)}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h1 className="text-h2 text-[var(--color-text-primary)]">
                {freelancer.name}
              </h1>
              {freelancer.isVerified && <VerifiedBadge size={18} />}
            </div>

            <div className="flex justify-center mb-4">
              <StarRating rating={freelancer.averageRating || 0} size={15} />
            </div>

            <div className="flex justify-center gap-6 mb-5">
              <div>
                <p className="text-h3 text-[var(--color-text-primary)]">
                  ${freelancer.hourlyRate || 0}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  per hour
                </p>
              </div>
              <div className="w-px bg-[#e5e7eb]" />
              <div>
                <p className="text-h3 text-[var(--color-text-primary)]">
                  {freelancer.completedJobsCount || 0}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  jobs done
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {(freelancer.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)] px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Bio + Reviews */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <h2 className="text-h3 text-[var(--color-text-primary)] mb-3">
              About
            </h2>
            <p className="text-body text-[var(--color-text-secondary)] whitespace-pre-line">
              {freelancer.bio || "This freelancer hasn't added a bio yet."}
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <h2 className="text-h3 text-[var(--color-text-primary)] mb-4">
              Reviews {!reviewsLoading && `(${reviews.length})`}
            </h2>
            <ReviewsList reviews={reviews} loading={reviewsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

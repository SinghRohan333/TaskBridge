"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/ui/StarRating";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewsList({ reviews, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-[#f3f4f6] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        No reviews yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => {
        const date = new Date(review.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={review._id}
            className="border-b border-[#e5e7eb] pb-4 last:border-0"
          >
            <div className="flex items-center gap-3 mb-2">
              {review.reviewer_image ? (
                <img
                  src={review.reviewer_image}
                  alt={review.reviewer_name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[var(--color-blue-light)] text-white flex items-center justify-center text-xs font-semibold">
                  {getInitials(review.reviewer_name)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {review.reviewer_name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {date}
                </p>
              </div>
            </div>

            <StarRating rating={review.rating} size={13} />

            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}

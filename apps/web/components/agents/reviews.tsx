"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ReviewsProps {
  agentId: string;
  agentName: string;
}

const mockReviews = [
  {
    id: "r1",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    rating: 5,
    content:
      "Game changer for my trading workflow. The orderbook analysis has helped me spot whale movements I would have completely missed. Highly recommend.",
    createdAt: "2025-12-15T10:30:00Z",
  },
  {
    id: "r2",
    walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    rating: 4,
    content:
      "Solid agent with great documentation. Setup was straightforward. Would love to see more customization options for alerts.",
    createdAt: "2025-12-10T14:20:00Z",
  },
  {
    id: "r3",
    walletAddress: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    rating: 5,
    content:
      "Been using this for 3 months now. The accuracy of signals has improved my win rate significantly. Worth every star.",
    createdAt: "2025-11-28T08:15:00Z",
  },
  {
    id: "r4",
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    rating: 3,
    content:
      "Good concept but needs more chain support. Currently only works well on Arbitrum. Looking forward to Base support.",
    createdAt: "2025-11-20T16:45:00Z",
  },
];

const ratingDistribution = [
  { stars: 5, pct: 50 },
  { stars: 4, pct: 25 },
  { stars: 3, pct: 25 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
];

const averageRating =
  mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function addressToGradient(addr: string) {
  const hash = addr.slice(2, 14);
  const h1 = parseInt(hash.slice(0, 4), 16) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 50%), hsl(${h2}, 60%, 40%))`;
}

function relativeTime(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

function StarIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

export function Reviews({ agentId, agentName }: ReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowForm(false);
    setSelectedRating(0);
    setReviewContent("");
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-text-primary">
            Reviews ({mockReviews.length})
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[36px] font-bold tabular-nums leading-none text-text-primary">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= Math.round(averageRating)}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(averageRating)
                        ? "text-amber-400"
                        : "text-white/[0.12]"
                    )}
                  />
                ))}
              </div>
              <span className="text-[12px] text-text-muted">
                {mockReviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="w-full max-w-[220px] space-y-1.5">
          {ratingDistribution.map((row) => (
            <div key={row.stars} className="flex items-center gap-2">
              <span className="w-[14px] text-right text-[12px] tabular-nums text-text-muted">
                {row.stars}
              </span>
              <StarIcon filled className="h-3 w-3 text-amber-400" />
              <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-amber-400/80 transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-[32px] text-right text-[11px] tabular-nums text-text-muted">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review */}
      <div className="mt-8">
        {submitted && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-[13px] text-green-400">
            Thank you! Your review has been submitted.
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => {
              setShowForm(true);
              setSubmitted(false);
            }}
            className="rounded-full border border-white/[0.06] px-5 py-[8px] text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            Write a Review
          </button>
        ) : (
          <div className="glass-card animate-fade-in-up rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-text-primary">
              Review {agentName}
            </h3>

            {/* Star selector */}
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <StarIcon
                    filled={star <= (hoveredRating || selectedRating)}
                    className={cn(
                      "h-7 w-7 cursor-pointer transition-colors duration-150",
                      star <= (hoveredRating || selectedRating)
                        ? "text-amber-400"
                        : "text-white/[0.12]"
                    )}
                  />
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-2 text-[12px] text-text-muted">
                  {selectedRating} / 5
                </span>
              )}
            </div>

            {/* Textarea */}
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Share your experience with this agent..."
              rows={4}
              className="mt-4 w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[14px] leading-[1.6] text-text-primary placeholder:text-text-muted/50 focus:border-purple-500/30 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
            />

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={selectedRating === 0}
                className={cn(
                  "group relative overflow-hidden rounded-full px-5 py-[8px] text-[13px] font-semibold text-white transition-all duration-300",
                  selectedRating > 0
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
                    : "cursor-not-allowed bg-white/[0.06] text-text-muted"
                )}
              >
                {selectedRating > 0 && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
                )}
                <span className="relative">Submit Review</span>
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedRating(0);
                  setHoveredRating(0);
                  setReviewContent("");
                }}
                className="text-[13px] text-text-muted transition-colors duration-200 hover:text-text-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review List */}
      <div className="mt-8">
        {mockReviews.map((review, idx) => (
          <div
            key={review.id}
            className={cn(
              "animate-fade-in-up py-5",
              idx < mockReviews.length - 1 && "border-b border-white/[0.04]"
            )}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: addressToGradient(review.walletAddress) }}
              >
                {review.walletAddress.slice(2, 4).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[13px] text-text-secondary">
                    {truncateAddress(review.walletAddress)}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {relativeTime(review.createdAt)}
                  </span>
                </div>
                <div className="mt-0.5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      filled={star <= review.rating}
                      className={cn(
                        "h-3 w-3",
                        star <= review.rating
                          ? "text-amber-400"
                          : "text-white/[0.12]"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-text-secondary">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

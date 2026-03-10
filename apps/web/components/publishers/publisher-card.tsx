import Link from "next/link";

interface PublisherCardProps {
  publisher: {
    slug: string;
    displayName: string;
    description: string | null;
    isVerified: boolean | null;
    isEcosystemPartner: boolean | null;
    avatarUrl: string | null;
  };
}

export function PublisherCard({ publisher }: PublisherCardProps) {
  return (
    <Link href={`/publisher/${publisher.slug}`} className="group block">
      <div className="glass-card card-hover rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-[13px] font-bold text-purple-400 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
            {publisher.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-text-primary transition-colors duration-200 group-hover:text-white">
                {publisher.displayName}
              </span>
              {publisher.isVerified && (
                <svg
                  className="h-3.5 w-3.5 text-purple-400"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.71-3.71.7.71z" />
                </svg>
              )}
            </div>
            {publisher.isEcosystemPartner && (
              <span className="text-[11px] text-purple-400/80">
                Ecosystem Partner
              </span>
            )}
          </div>
        </div>
        {publisher.description && (
          <p className="mt-3 text-[13px] leading-[1.6] text-text-secondary line-clamp-2">
            {publisher.description}
          </p>
        )}
      </div>
    </Link>
  );
}

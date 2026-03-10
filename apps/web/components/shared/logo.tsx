"use client";

import { useId } from "react";

const SPARKLE = "M18 4C20 13 25 17 32 18C25 19 20 23 18 32C16 23 11 19 4 18C11 17 16 13 18 4Z";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={32} />
      <span className="text-[18px] font-extrabold tracking-[-0.03em] text-white">
        Orderly<span className="text-[#9B30FF]">Agents</span>
      </span>
    </span>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const gid = `lg${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 transition-[filter] duration-300 hover:drop-shadow-[0_0_8px_rgba(155,48,255,0.5)]"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CC44FF" />
          <stop offset="100%" stopColor="#7700CC" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill="#12111A" />
      <path fill={`url(#${gid})`} d={SPARKLE} />
    </svg>
  );
}

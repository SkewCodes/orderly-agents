"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { WalletConnect } from "@/components/shared/wallet-connect";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/teams", label: "Teams" },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.04] bg-[rgba(6,5,14,0.72)] shadow-[0_1px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-[1.8]"
          : "border-b border-transparent bg-transparent"
      )}
      role="banner"
    >
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="OrderlyAgents Home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-[7px] text-[13px] font-medium tracking-[-0.01em] transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-white/[0.06] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.1)]" />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block">
          <WalletConnect />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
            ) : (
              <path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out md:hidden",
          mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="border-t border-white/[0.04] px-5 pb-5 pt-3">
          <nav className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] transition-all duration-200",
                  pathname.startsWith(link.href)
                    ? "bg-white/[0.06] text-white"
                    : "text-text-muted hover:bg-white/[0.03] hover:text-text-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-white/[0.04] pt-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

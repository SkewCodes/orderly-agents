import Link from "next/link";
import { LogoMark } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/teams", label: "Agent Teams" },
                { href: "/marketplace", label: "Marketplace" },
                { href: "/publish", label: "Publish Agent" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-text-muted transition-colors duration-200 hover:text-text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Ecosystem
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "https://orderly.network", label: "Orderly Network" },
                { href: "https://woo.org", label: "WOO Network" },
                { href: "https://orderly.network/build", label: "DEX Builder" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-text-muted transition-colors duration-200 hover:text-text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Developers
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "https://docs.orderly.network", label: "Documentation" },
                { href: "https://github.com/OrderlyNetwork", label: "GitHub" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-text-muted transition-colors duration-200 hover:text-text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Community
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "https://twitter.com/OrderlyNetwork", label: "Twitter" },
                { href: "https://discord.gg/orderlynetwork", label: "Discord" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-text-muted transition-colors duration-200 hover:text-text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/[0.04] pt-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <p className="text-[12px] text-text-muted">
              Powered by{" "}
              <a
                href="https://orderly.network"
                className="text-purple-400/80 transition-colors duration-200 hover:text-purple-400"
              >
                Orderly Network
              </a>
            </p>
          </div>
          <p className="text-[12px] text-text-muted">
            &copy; {new Date().getFullYear()} OrderlyAgents
          </p>
        </div>
      </div>
    </footer>
  );
}

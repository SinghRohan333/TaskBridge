import Link from "next/link";
import LogoLinkedin from "@gravity-ui/icons/LogoLinkedin";
import LogoFacebook from "@gravity-ui/icons/LogoFacebook";
import LogoTelegram from "@gravity-ui/icons/LogoTelegram";
import Logo from "./Logo";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tasks", href: "/browse-tasks" },
  { label: "Browse Freelancers", href: "/browse-freelancers" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="text-lg font-bold text-white">TaskBridge</span>
          </span>
          <p className="footer-text text-sm max-w-xs">
            Get your tasks done by skilled freelancers — fast, simple, reliable.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-link text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <a
            href="mailto:support@taskbridge.com"
            className="footer-text text-sm hover:text-white transition-colors"
          >
            support@taskbridge.com
          </a>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TaskBridge on X"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TaskBridge on LinkedIn"
            >
              <LogoLinkedin width={20} height={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TaskBridge on Facebook"
            >
              <LogoFacebook width={20} height={20} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TaskBridge on Telegram"
            >
              <LogoTelegram width={20} height={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1f2937] py-4">
        <p className="footer-text text-center text-xs">
          © {year} TaskBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

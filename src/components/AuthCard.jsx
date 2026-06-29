import Link from "next/link";
import Logo from "./Logo";

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="w-full max-w-md bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 md:p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="h-10 w-10" />
          <h1 className="text-h2 text-[var(--color-text-primary)] text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body text-[var(--color-text-secondary)] text-center">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footerText && (
          <p className="text-sm text-[var(--color-text-secondary)] text-center mt-6">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="text-[var(--color-brand-blue)] font-medium hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

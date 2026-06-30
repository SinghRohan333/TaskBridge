import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <p className="text-sm font-semibold text-[var(--color-brand-blue)] mb-2 tracking-wide">
          404 ERROR
        </p>

        <h1 className="text-h1 text-[var(--color-text-primary)] mb-3">
          Page not found
        </h1>

        <p className="text-body text-[var(--color-text-secondary)] mb-8">
          The page you are looking for does not exist, may have been moved, or
          the link you followed is broken.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[var(--color-brand-blue)] hover:bg-[var(--color-blue-dark)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            href="/browse-tasks"
            className="border border-[#e5e7eb] text-[var(--color-text-primary)] hover:bg-[#f9fafb] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

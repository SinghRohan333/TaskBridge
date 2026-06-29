"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars, Xmark } from "@gravity-ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tasks", href: "/browse-tasks" },
  { label: "Browse Freelancers", href: "/browse-freelancers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // ...inside component:
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role || "client";

  const dashboardHref =
    role === "freelancer"
      ? "/dashboard/freelancer"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/client";

  const privateLinks = [
    { label: "Dashboard", href: dashboardHref },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You have been logged out");
          router.push("/");
        },
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href) => pathname === href;

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            TaskBridge
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`nav-link text-sm font-medium ${isActive(link.href) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`nav-link text-sm font-medium ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-md bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-text-primary)]"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Bars width={24} height={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Logo className="h-7 w-7" />
                  <span className="text-lg font-bold text-[var(--color-text-primary)]">
                    TaskBridge
                  </span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="text-[var(--color-text-secondary)]"
                >
                  <Xmark width={22} height={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`nav-link text-base ${isActive(link.href) ? "active" : ""}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {isLoggedIn &&
                  privateLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`nav-link text-base ${isActive(link.href) ? "active" : ""}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
              </nav>

              <div className="mt-auto">
                {isLoggedIn ? (
                  <button
                    className="w-full text-sm font-medium text-[var(--color-text-secondary)]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="block text-center text-sm font-medium px-4 py-2 rounded-md bg-[var(--color-brand-blue)] text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

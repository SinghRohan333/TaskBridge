"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bars } from "@gravity-ui/icons";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-[var(--color-bg)]">
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:flex flex-col flex-shrink-0">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed top-0 left-0 h-full z-50 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#e5e7eb]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-[var(--color-text-primary)]"
          >
            <Bars width={22} height={22} />
          </button>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Dashboard
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

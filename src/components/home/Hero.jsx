"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-[var(--color-bg)] px-4 md:px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-hero text-[var(--color-text-primary)] mb-4">
          Get your tasks done by skilled freelancers
        </h1>
        <p className="text-body text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto">
          Post a task, get proposals from talented freelancers, and pay securely
          — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 rounded-md bg-[var(--color-brand-blue)] text-white font-medium hover:bg-[var(--color-blue-dark)] transition-colors"
          >
            Post a Task
          </Link>
          <Link
            href="/browse-tasks"
            className="px-6 py-3 rounded-md border border-[#e5e7eb] text-[var(--color-text-primary)] font-medium hover:bg-[#f3f4f6] transition-colors"
          >
            Browse Tasks
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

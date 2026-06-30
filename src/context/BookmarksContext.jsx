"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const BookmarksContext = createContext(null);

export function BookmarksProvider({ children }) {
  const { data: session } = authClient.useSession();
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const role = session?.user?.role;

  const refresh = useCallback(() => {
    if (role !== "freelancer") {
      setBookmarkedIds(new Set());
      return;
    }
    apiFetch("/api/bookmarks")
      .then((data) => setBookmarkedIds(new Set(data.bookmarkedIds || [])))
      .catch(() => setBookmarkedIds(new Set()));
  }, [role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (taskId) => {
      const wasBookmarked = bookmarkedIds.has(taskId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        wasBookmarked ? next.delete(taskId) : next.add(taskId);
        return next;
      });

      try {
        await apiFetch(`/api/bookmarks/${taskId}`, { method: "POST" });
      } catch {
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          wasBookmarked ? next.add(taskId) : next.delete(taskId);
          return next;
        });
      }
    },
    [bookmarkedIds],
  );

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        toggle,
        refresh,
        isFreelancer: role === "freelancer",
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx)
    throw new Error("useBookmarks must be used within BookmarksProvider");
  return ctx;
}

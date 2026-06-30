export function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const categoryColors = {
  Design: "bg-[var(--color-blue-tint)] text-[var(--color-blue-dark)]",
  Writing: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  Development: "bg-[#ede9fe] text-[var(--color-admin-purple)]",
  Marketing: "bg-[#fef3c7] text-[#92400e]",
  Other: "bg-[#f3f4f6] text-[var(--color-text-secondary)]",
};

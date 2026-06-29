"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PostTaskForm from "@/components/dashboard/client/PostTaskForm";
import { useRouter } from "next/navigation";

export default function PostTaskPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/client/my-tasks");
  };

  return (
    <DashboardLayout>
      <h1 className="text-h1 text-[var(--color-text-primary)] mb-6">
        Post a Task
      </h1>
      <PostTaskForm onSuccess={handleSuccess} />
    </DashboardLayout>
  );
}

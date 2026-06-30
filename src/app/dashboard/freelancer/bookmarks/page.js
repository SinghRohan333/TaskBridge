import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookmarkedTasksPage from "@/components/freelancers/BookmarkedTasksPage";

export const metadata = { title: "Bookmarked Tasks — TaskBridge" };

export default function Page() {
  return (
    <DashboardLayout>
      <BookmarkedTasksPage />
    </DashboardLayout>
  );
}

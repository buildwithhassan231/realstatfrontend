import ManageUsersPage from "@/components/admin/ManageUsersPage";

export const metadata = {
  title: "Manage Users — PropFind Admin",
  description: "View, block and manage all registered users on PropFind.",
};

export default function AdminUsersRoute() {
  return <ManageUsersPage />;
}

import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard — PropFind",
  description: "PropFind platform administration overview.",
};

export default function AdminRoute() {
  return <AdminDashboard />;
}

import ManageCategoriesPage from "@/components/admin/ManageCategoriesPage";

export const metadata = {
  title: "Manage Categories — PropFind Admin",
  description: "Add, edit, reorder and manage property categories on PropFind.",
};

export default function AdminCategoriesRoute() {
  return <ManageCategoriesPage />;
}

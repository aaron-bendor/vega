import { getAdminAuth } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminContent } from "@/components/admin/AdminContent";

export default async function AdminPage() {
  const { authenticated } = getAdminAuth();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  return <AdminContent />;
}

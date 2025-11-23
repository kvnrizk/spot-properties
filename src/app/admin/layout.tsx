import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import AdminLayoutClient from "./admin-layout-client";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Add Property", href: "/admin/properties/new" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Activity Logs", href: "/admin/activity" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Redirect to home if not admin
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <SessionProvider>
      <ToastProvider />
      <AdminLayoutClient session={session} navItems={navItems}>
        {children}
      </AdminLayoutClient>
    </SessionProvider>
  );
}

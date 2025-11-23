"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, LogOut, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";

type NavItem = {
  label: string;
  href: string;
};

type AdminLayoutClientProps = {
  children: React.ReactNode;
  session: any;
  navItems: NavItem[];
};

export default function AdminLayoutClient({
  children,
  session,
  navItems,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "A";

  return (
    <div className="flex min-h-screen bg-spot-beige">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-spot-red flex items-center">
              Sp<MapPin className="w-5 h-5 mx-0.5 fill-spot-red" />t{" "}
              <span className="text-spot-dark ml-1">Admin</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-spot-red text-white"
                      : "text-spot-dark hover:bg-spot-beige"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-spot-red flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-spot-dark truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-spot-dark/60 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-spot-dark hover:text-spot-red hover:border-spot-red"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="lg:hidden"></div>
            <h2 className="text-lg font-semibold text-spot-dark lg:ml-0 ml-12">
              Admin Panel
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-spot-red flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Store, CreditCard, LogOut, Menu, X, ShieldAlert, User, Mail } from "lucide-react";
import Button from "@/components/ui/button";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading Session...
      </div>
    );
  }

  // Ensure user is super admin (already verified by middleware, but check as double layer)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h1>
        <p className="text-slate-400 mb-6">You must be logged in as a Super Admin to access this panel.</p>
        <Button onClick={() => router.push("/login")} className="bg-orange-500 hover:bg-orange-600">
          Go to Login
        </Button>
      </div>
    );
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Restaurants (Tenants)",
      href: "/super-admin/restaurants",
      icon: Store,
    },
    {
      name: "Subscription Plans",
      href: "/super-admin/plans",
      icon: CreditCard,
    },
    {
      name: "Leads & Inquiries",
      href: "/super-admin/leads",
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight">Super Panel</h1>
            <p className="text-xs text-orange-500/80 font-medium uppercase tracking-wider">Restro SaaS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-l-2 border-orange-500 text-orange-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-900 bg-slate-900/30 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-lg shadow-sm">
            S
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">Super Panel</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-slate-950/80 backdrop-blur-lg pt-16 flex flex-col p-6">
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 border-l-2 border-orange-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="pt-6 border-t border-slate-900">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut as nextSignOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import useSocket from "@/hooks/useSocket";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  TableProperties,
  Users,
  Ticket,
  Settings as SettingsIcon,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  User,
  Bell,
  Check,
} from "lucide-react";
import Button from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: restaurantResponse } = useQuery<{ success: boolean; data: { name: string } }>({
    queryKey: ["admin", "restaurant-info"],
    queryFn: () => apiFetch("/api/admin/restaurant-info"),
    enabled: status === "authenticated",
  });

  const restaurantName = restaurantResponse?.data?.name || "Admin Console";

  const branchId = (session?.user as any)?.branchId;
  const [activeCalls, setActiveCalls] = useState<Array<{ id: string; tableNumber: string; time: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const socket = useSocket(branchId);

  useEffect(() => {
    if (!socket) return;

    socket.on("waiter-called", (data: any) => {
      // Play high pitch bell sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5 note
        osc.frequency.exponentialRampToValueAtTime(1318.51, audioCtx.currentTime + 0.15); // E6

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 1.0);
      } catch (e) {
        console.warn("Autoplay audio blocked:", e);
      }

      toast(`🛎️ Table ${data.tableNumber} needs assistance!`, {
        icon: "💁",
        style: {
          background: "#ea580c",
          color: "#fff",
        },
      });

      setActiveCalls((prev) => {
        if (prev.some((c) => c.tableNumber === data.tableNumber)) return prev;
        return [
          {
            id: Math.random().toString(),
            tableNumber: data.tableNumber,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.off("waiter-called");
    };
  }, [socket]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading Session...
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (!session || (role !== "RESTAURANT_ADMIN" && role !== "SUPER_ADMIN")) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <ShieldCheck className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h1>
        <p className="text-slate-400 mb-6">You must be logged in as a Restaurant Admin to access this panel.</p>
        <Button onClick={() => router.push("/login")} className="bg-orange-500 hover:bg-orange-600">
          Go to Login
        </Button>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Live Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Menu Items", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Tables & QRs", href: "/admin/tables", icon: TableProperties },
    { name: "Staff Credentials", href: "/admin/staff", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xl shadow-md">
            R
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight truncate max-w-[150px]">{restaurantName}</h1>
            <p className="text-xs text-orange-500/85 font-semibold uppercase tracking-wider">Tenant Node</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-250 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-l-2 border-orange-500 text-orange-500 font-bold"
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
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-350">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => nextSignOut({ callbackUrl: "/login" })}
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
            R
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">{restaurantName}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
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
              onClick={() => nextSignOut({ callbackUrl: "/login" })}
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
        {/* Top Navbar Header */}
        <div className="flex justify-end items-center gap-4 mb-6 pb-4 border-b border-slate-900/40 relative">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-slate-900 border border-slate-850 hover:bg-slate-850 p-2.5 rounded-xl text-slate-400 hover:text-white transition-all shadow-md relative cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {activeCalls.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                  {activeCalls.length}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2.5 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in-50 slide-in-from-top-3 duration-150">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Waiter Calls</h4>
                  {activeCalls.length > 0 && (
                    <button
                      onClick={() => setActiveCalls([])}
                      className="text-[10px] font-bold text-orange-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {activeCalls.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No active service calls.</p>
                  ) : (
                    activeCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex justify-between items-center bg-slate-950/60 border border-slate-850/50 p-2.5 rounded-xl text-xs gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-white">Table {call.tableNumber}</p>
                          <p className="text-[9px] text-slate-500 font-semibold">Requested: {call.time}</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveCalls((prev) => prev.filter((c) => c.id !== call.id));
                            toast.success(`Cleared Table ${call.tableNumber} alert`);
                          }}
                          className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/25 transition-colors cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

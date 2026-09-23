"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        
        // Fetch session to determine role-based redirect
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        
        const role = session?.user?.role;
        if (role === "SUPER_ADMIN") {
          router.push("/super-admin/dashboard");
        } else if (role === "RESTAURANT_ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "BRANCH_MANAGER") {
          router.push("/branch/dashboard");
        } else if (role === "KITCHEN") {
          router.push("/kitchen");
        } else if (role === "STAFF" || role === "CASHIER") {
          router.push("/staff");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060813] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background radial gradient glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Elegant background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-2">
          {/* Logo icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-3xl shadow-lg shadow-orange-500/25 select-none hover:scale-105 transition-transform">
            R
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            Please sign in with your credentials to access your SaaS control panel.
          </p>
        </div>

        {/* Login form card */}
        <div className="bg-gradient-to-b from-slate-900/30 to-slate-950/40 border border-slate-800/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email field */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-[39px] h-4.5 w-4.5 text-slate-500 pointer-events-none" />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11"
                required
                disabled={loading}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-[39px] h-4.5 w-4.5 text-slate-500 pointer-events-none" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                required
                disabled={loading}
              />
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-655 hover:to-amber-705 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all duration-100 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Accounts Auto-fill Box */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            <p className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
              ⚡ Quick Demo Login (Click to Auto-fill)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setEmail("superadmin@restro-saas.com");
                  setPassword("SuperAdminPassword123!");
                  toast.success("Loaded Super Admin credentials!");
                }}
                className="bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-black text-purple-400 group-hover:underline">👑 Super Admin</div>
                <div className="text-[10px] text-slate-400 truncate">superadmin@restro-saas.com</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("admin@tastybites.com");
                  setPassword("AdminPassword123!");
                  toast.success("Loaded Restaurant Admin credentials!");
                }}
                className="bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-300 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-black text-orange-400 group-hover:underline">🏪 Restro Admin</div>
                <div className="text-[10px] text-slate-400 truncate">admin@tastybites.com</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("chef@tastybites.com");
                  setPassword("ChefPassword123!");
                  toast.success("Loaded Kitchen Chef credentials!");
                }}
                className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-black text-rose-400 group-hover:underline">🍳 Kitchen KDS</div>
                <div className="text-[10px] text-slate-400 truncate">chef@tastybites.com</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("waiter@tastybites.com");
                  setPassword("WaiterPassword123!");
                  toast.success("Loaded Staff Waiter credentials!");
                }}
                className="bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-black text-blue-400 group-hover:underline">🛎️ Floor Staff</div>
                <div className="text-[10px] text-slate-400 truncate">waiter@tastybites.com</div>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 pt-4 border-t border-slate-850/80 text-center">
            <p className="text-xs text-slate-400 leading-normal">
              Want to onboard your restaurant?{" "}
              <Link
                href="/register"
                className="font-bold text-orange-500 hover:text-orange-400 transition-colors"
              >
                Request Partner Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

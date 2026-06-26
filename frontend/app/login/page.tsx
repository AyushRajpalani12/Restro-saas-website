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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-2xl shadow-lg shadow-orange-500/20">
            R
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Enter your details to access your dashboard
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-transform duration-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-sm text-slate-400">
              Want to register your restaurant?{" "}
              <Link
                href="/register"
                className="font-semibold text-orange-500 hover:text-orange-400 transition-colors"
              >
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

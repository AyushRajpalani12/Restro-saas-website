"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { KeyRound, Lock, ArrowRight, Loader2, ArrowLeft, Mail } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otpCode || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otpCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      toast.success(data.message || "Password reset successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 z-10 font-sans">
      <div className="text-center space-y-4">
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors bg-white/5 border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Request another code
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
          Reset Password
        </h2>
        <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
          Enter the 6-digit OTP code sent to your email and your new password
        </p>
      </div>

      {/* Reset card container */}
      <div className="bg-gradient-to-b from-slate-900/30 to-slate-950/40 border border-slate-800/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl shadow-black/50">
        <form onSubmit={handleSubmit} className="space-y-5">
          
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
              disabled={loading || !!searchParams.get("email")}
            />
          </div>

          {/* OTP code field */}
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-[39px] h-4.5 w-4.5 text-slate-500 pointer-events-none" />
            <Input
              label="OTP Code"
              type="text"
              placeholder="6-digit code"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Limit OTP to digits
                setOtpCode(val);
              }}
              className="pl-11"
              required
              disabled={loading}
            />
          </div>

          {/* New password field */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-[39px] h-4.5 w-4.5 text-slate-500 pointer-events-none" />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-11"
              required
              disabled={loading}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-655 hover:to-amber-705 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform duration-100 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Resetting password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060813] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none" />

      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

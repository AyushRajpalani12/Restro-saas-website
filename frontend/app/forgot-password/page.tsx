"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      toast.success(data.message || "OTP code sent to email!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060813] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors bg-white/5 border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
            Forgot Password
          </h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            Enter your registered email below and we will send a 6-digit verification code to reset your password.
          </p>
        </div>

        {/* Forgot password card */}
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

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-655 hover:to-amber-705 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform duration-100 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

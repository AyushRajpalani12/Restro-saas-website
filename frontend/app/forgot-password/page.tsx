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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Enter your email address and we will send you a 6-digit OTP code to reset your password.
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-transform duration-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

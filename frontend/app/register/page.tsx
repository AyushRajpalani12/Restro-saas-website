"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { ArrowRight, Loader2, Store, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurantName || !ownerName || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName,
          ownerName,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      toast.success("Inquiry submitted successfully!");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

        <div className="w-full max-w-lg space-y-8 z-10 text-center">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-10 shadow-2xl space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Request Submitted!
              </h2>
              <p className="text-sm text-slate-400">
                Thank you for your interest in Restro SaaS.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/50 text-left text-xs leading-relaxed text-slate-400 space-y-2">
              <p>
                <strong>What happens next?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Our sales team will review your inquiry details.</li>
                <li>We will contact you at <span className="text-white">{email}</span> within 24 hours.</li>
                <li>A customized demo setup will be prepared for <span className="text-white">{restaurantName}</span>.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-orange-500/10"
              >
                Return to Homepage
              </Button>
              <Link
                href="/login"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
              >
                Or, Sign In to an existing console account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-lg space-y-8 z-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-2xl shadow-lg shadow-orange-500/20">
            R
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Register your Interest
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Submit your details. Our Super Admin will verify and create your account.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Store className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
              <Input
                label="Restaurant Name *"
                type="text"
                placeholder="The Gourmet Cafe"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
              <Input
                label="Owner Name *"
                type="text"
                placeholder="John Doe"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="admin@cafe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
                <Input
                  label="Phone Number *"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-3 top-[38px] h-5 w-5 text-slate-500" />
              <Textarea
                label="Requirements / Message (Optional)"
                placeholder="Tell us about your restaurant branches, tables, or custom request..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pl-10"
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="text-xs text-slate-500">
              * Required fields. By submitting, you agree to our Terms of Service.
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-transform duration-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting request...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-500 hover:text-orange-400 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


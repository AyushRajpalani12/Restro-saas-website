"use client";

import React from "react";
import Link from "next/link";
import { Store, ArrowRight, Sparkles } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          {/* Subtle background glow circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Instant 14-Day Free Trial
            </span>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Dining Operations?
            </h2>

            <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Join hundreds of restaurants delivering faster dining experiences, zero order entry mistakes, and higher table turnover.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-4 px-9 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
              >
                <Store className="h-4.5 w-4.5 text-orange-400" />
                Request Access Now
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-9 rounded-2xl border border-white/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
              >
                Sign In to Console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

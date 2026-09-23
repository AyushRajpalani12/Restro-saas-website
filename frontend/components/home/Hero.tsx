"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Store, ShieldCheck, Play, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-orange-50/50 via-slate-50 to-slate-50">
      {/* Dynamic Background Accents */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-200/40 to-amber-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-xs animate-bounce">
          <Sparkles className="h-3.5 w-3.5 text-orange-600" /> Multi-Tenant Dining OS & KDS Engine
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.12]">
          Modernize Your Restaurant with{" "}
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            Restro SaaS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
          Eliminate order delays with instant QR table ordering, real-time Kitchen Line KDS screens, live waiter call notifications, and multi-branch management.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all text-sm"
          >
            <Store className="h-4.5 w-4.5" />
            Request Free Access
          </Link>
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-sm"
          >
            <Play className="h-4 w-4 text-orange-600 fill-orange-600" />
            Try Live Demo
          </a>
        </div>

        {/* Feature Highlights Ticker */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 0% POS Commission
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant QR Menu Sync
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Live Kitchen Audio Bell
          </div>
        </div>

        {/* Hero Preview Frame */}
        <div className="mt-14 w-full max-w-5xl bg-white/80 p-3 rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/50 backdrop-blur-xl">
          <div className="bg-slate-900 rounded-2xl p-4 md:p-6 text-left text-white overflow-hidden relative border border-slate-800">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">restro-saas.console/admin/orders</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> WebSocket Live Sync Active
              </div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Order Ticket 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-400">TABLE #04</span>
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    NEW ORDER
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p className="font-semibold text-white">2x Butter Chicken Special</p>
                  <p className="font-semibold text-white">3x Garlic Naan Bread</p>
                  <p className="text-[10px] text-slate-400 italic">Addon: Extra Cheese Sauce</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Total: ₹840</span>
                  <span className="text-emerald-400 font-bold text-[11px]">02 mins ago</span>
                </div>
              </div>

              {/* Order Ticket 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-400">TABLE #12</span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    PREPARING
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p className="font-semibold text-white">1x Woodfired Pepperoni Pizza</p>
                  <p className="font-semibold text-white">2x Chilled Ice Tea</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Total: ₹690</span>
                  <span className="text-amber-400 font-bold text-[11px]">Chef cooking</span>
                </div>
              </div>

              {/* Service Call Alert */}
              <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-orange-400">TABLE #08</span>
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                    WAITER CALLED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Customer requested water refills & additional napkins.</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[10px]">Chime Played 🔔</span>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded">
                    Acknowledge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

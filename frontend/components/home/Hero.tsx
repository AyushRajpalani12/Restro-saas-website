"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, CheckCircle2, Bell, ChefHat, Smartphone, TrendingUp, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-36 bg-[#090d16] text-white overflow-hidden">
      {/* Background Radial Glow Mesh & Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-orange-500/15 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-500/30 text-orange-400 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-8 shadow-lg shadow-orange-500/10"
        >
          <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
          Funded Startup-Grade Restaurant Operating System
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[1.08]"
        >
          Run Your Restaurant Smarter.{" "}
          <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Serve Every Customer Better.
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed font-medium"
        >
          Manage digital QR ordering, kitchen operations, staff requests, and restaurant performance from one powerful platform built for modern restaurants.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10 w-full sm:w-auto"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-4 px-9 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-95 transition-all text-sm group"
          >
            Start Your Free Trial
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 px-9 rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 transition-all text-sm"
          >
            <Play className="h-4 w-4 text-orange-400 fill-orange-400" />
            Explore Live Demo
          </a>
        </motion.div>

        {/* Feature Highlights Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-10 text-xs font-bold text-slate-400"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 0% POS Commission
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant QR Menu Sync
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Live Kitchen Audio Bell
          </div>
        </motion.div>

        {/* Product Showcase Mockup Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 w-full max-w-5xl bg-gradient-to-b from-white/10 to-white/5 p-3 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-2xl relative"
        >
          {/* Top Bar inside mockup */}
          <div className="bg-[#0b0f19] rounded-2xl p-4 md:p-6 text-left border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">restro-saas.console/live-operations</span>
              </div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> WebSocket Real-time Sync Active
              </div>
            </div>

            {/* Mock Dashboard Operational Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Operational Card 1: Kitchen Order Ticket */}
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <ChefHat className="h-4 w-4 text-orange-400" /> TABLE #04
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    NEW TICKET
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300 font-medium">
                  <p className="font-semibold text-white">2x Butter Chicken Special</p>
                  <p className="font-semibold text-white">3x Garlic Naan Bread</p>
                  <p className="text-[10px] text-slate-400 italic">Addon: Extra Cheese Dip</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Total: ₹840</span>
                  <span className="text-emerald-400 font-bold text-[11px]">02 mins ago</span>
                </div>
              </div>

              {/* Operational Card 2: QR Table Ordering Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-blue-400" /> TABLE #12
                  </span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    PREPARING
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300 font-medium">
                  <p className="font-semibold text-white">1x Woodfired Pepperoni Pizza</p>
                  <p className="font-semibold text-white">2x Chilled Ice Tea</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Total: ₹690</span>
                  <span className="text-amber-400 font-bold text-[11px]">Chef cooking</span>
                </div>
              </div>

              {/* Operational Card 3: Waiter Service Request Alert */}
              <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-orange-400 flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-orange-400" /> TABLE #08
                  </span>
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                    WAITER CALLED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Customer requested water refills & additional napkins.</p>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[10px]">Chime Played 🔔</span>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    Acknowledge
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Bar inside Mockup */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Today's Revenue</p>
                  <p className="font-extrabold text-white">₹42,850 (+18.5%)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Completed Orders</p>
                  <p className="font-extrabold text-white">128 Tickets</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Active Tables</p>
                  <p className="font-extrabold text-white">14 / 20 Occupied</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">System Status</p>
                  <p className="font-extrabold text-emerald-400">100% Operational</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

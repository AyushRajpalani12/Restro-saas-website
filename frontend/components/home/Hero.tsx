"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Bell,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Table,
  UserCheck,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#080b12] text-white overflow-hidden">
      {/* Background Radial Glow Mesh & Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-600/15 via-amber-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              MODERN RESTAURANT MANAGEMENT PLATFORM
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-black tracking-tight leading-[1.08] text-white"
            >
              Run Your Restaurant Smarter.{" "}
              <span className="text-orange-500 block sm:inline">
                Serve Every Customer Better.
              </span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base md:text-lg max-w-xl font-normal leading-relaxed"
            >
              Manage digital QR ordering, kitchen operations, staff requests, and restaurant performance from one powerful platform.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2"
            >
              <Link
                href="/register"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-95 transition-all text-sm group"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#interactive-demo"
                className="bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 transition-all text-sm"
              >
                <Play className="h-4 w-4 text-white fill-white" />
                Watch Live Demo
              </a>
            </motion.div>

            {/* Feature Bullet Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300 pt-1"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Easy Setup
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No POS Commission
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> For All Restaurant Types
              </div>
            </motion.div>

            {/* Key Metrics Grid (4 Stats) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Users className="h-4 w-4" />
                  <span className="text-xl font-black text-white">500+</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Restaurants</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xl font-black text-white">35%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Higher Table Turnover</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-xl font-black text-white">50%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Faster Ordering</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Star className="h-4 w-4 fill-orange-400" />
                  <span className="text-xl font-black text-white">99%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Customer Satisfaction</p>
              </div>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN (3D STACKED DEVICE SHOWCASE) ================= */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Ambient Background Warm Table Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-950/40 via-orange-950/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Cursive Handwriting Callout - Top Right */}
            <div className="absolute -top-10 right-4 z-40 hidden md:block">
              <span className="font-handwriting text-2xl text-amber-300 font-bold drop-shadow-md">
                Good Food Better Business
              </span>
            </div>

            {/* Top Floating Notification Badge (Waiter Assistance Pill) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-6 right-8 z-30 bg-[#121622]/95 border border-orange-500/30 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Bell className="h-4 w-4 animate-bounce text-orange-400" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-white">Table 5</span>
                  <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span>Needs Assistance</span>
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* CENTERPIECE DEVICE: TABLET MOCKUP (Admin KDS Dashboard) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="w-full max-w-lg lg:max-w-xl bg-[#0c101a] border border-slate-700/70 rounded-2xl shadow-2xl p-4 md:p-5 relative z-10 text-left font-sans"
            >
              {/* Tablet Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white text-xs">
                    R
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-sm">Restro<span className="text-orange-500">SaaS</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span>Mon, 23 Sep 2024</span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer">
                    Today <ChevronDown className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* Tablet Left Sidebar Icons */}
                <div className="col-span-3 bg-[#080b13] rounded-xl p-2.5 border border-white/5 space-y-1.5 text-[11px]">
                  <div className="bg-orange-500/20 text-orange-400 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-2">
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <ShoppingBag className="h-3.5 w-3.5" /> Orders
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <Utensils className="h-3.5 w-3.5" /> Menu
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <Table className="h-3.5 w-3.5" /> Tables
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <UserCheck className="h-3.5 w-3.5" /> Customers
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <Users className="h-3.5 w-3.5" /> Staff
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <BarChart3 className="h-3.5 w-3.5" /> Analytics
                  </div>
                  <div className="text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                    <Settings className="h-3.5 w-3.5" /> Settings
                  </div>
                </div>

                {/* Tablet Dashboard Content Area */}
                <div className="col-span-9 space-y-3">
                  {/* Welcome Greeting */}
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Welcome Back!</h3>
                    <p className="text-[10px] text-slate-400">Here's what's happening at your restaurant today.</p>
                  </div>

                  {/* 4 Stat KPI Mini Cards */}
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="bg-[#080b13] p-2 rounded-lg border border-white/5">
                      <p className="text-slate-400 font-medium">Total Orders</p>
                      <p className="font-extrabold text-white text-xs mt-0.5">128</p>
                      <p className="text-emerald-400 font-bold text-[9px] mt-0.5">↑ 12%</p>
                    </div>
                    <div className="bg-[#080b13] p-2 rounded-lg border border-white/5">
                      <p className="text-slate-400 font-medium">Total Revenue</p>
                      <p className="font-extrabold text-white text-xs mt-0.5">₹24,580</p>
                      <p className="text-emerald-400 font-bold text-[9px] mt-0.5">↑ 18%</p>
                    </div>
                    <div className="bg-[#080b13] p-2 rounded-lg border border-white/5">
                      <p className="text-slate-400 font-medium">Active Tables</p>
                      <p className="font-extrabold text-white text-xs mt-0.5">24</p>
                      <p className="text-emerald-400 font-bold text-[9px] mt-0.5">● Live</p>
                    </div>
                    <div className="bg-[#080b13] p-2 rounded-lg border border-white/5">
                      <p className="text-slate-400 font-medium">Pending Orders</p>
                      <p className="font-extrabold text-white text-xs mt-0.5">6</p>
                      <p className="text-amber-400 font-bold text-[9px] mt-0.5">In Queue</p>
                    </div>
                  </div>

                  {/* Recent Orders Mini Table */}
                  <div className="bg-[#080b13] p-2.5 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5">
                      <span className="font-bold text-slate-200">Recent Orders</span>
                      <span className="text-[10px] text-orange-400 font-semibold cursor-pointer">View All →</span>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">#1024 Paneer Tikka Pizza</span>
                        <span className="text-slate-400">Table 4</span>
                        <span className="text-slate-400">2 min ago</span>
                        <span className="bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded text-[9px]">Preparing</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">#1023 Chicken Biryani</span>
                        <span className="text-slate-400">Table 7</span>
                        <span className="text-slate-400">4 min ago</span>
                        <span className="bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[9px]">New</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">#1022 Margherita Pizza</span>
                        <span className="text-slate-400">Table 2</span>
                        <span className="text-slate-400">6 min ago</span>
                        <span className="bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[9px]">Ready</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">#1021 Veg Noodles</span>
                        <span className="text-slate-400">Table 5</span>
                        <span className="text-slate-400">8 min ago</span>
                        <span className="bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded text-[9px]">Preparing</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* FOREGROUND LEFT DEVICE: ACRYLIC TABLE QR STAND */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute -bottom-6 -left-2 sm:-left-6 z-20 w-32 sm:w-36 bg-gradient-to-b from-[#181d2a] to-[#0a0d14] border border-amber-500/30 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl text-center space-y-2"
            >
              <div className="flex items-center justify-center gap-1">
                <div className="h-4 w-4 rounded bg-orange-500 flex items-center justify-center text-white font-black text-[9px]">R</div>
                <span className="font-bold text-white text-[11px]">Restro<span className="text-orange-500">SaaS</span></span>
              </div>

              {/* QR Code graphic mockup */}
              <div className="bg-white p-2 rounded-xl shadow-inner mx-auto w-24 h-24 flex flex-col items-center justify-center relative">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                  <rect x="9" y="9" width="12" height="12" />

                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                  <rect x="79" y="9" width="12" height="12" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                  <rect x="9" y="79" width="12" height="12" />

                  {/* Random QR dots */}
                  <rect x="35" y="10" width="8" height="8" />
                  <rect x="48" y="10" width="8" height="8" />
                  <rect x="35" y="24" width="8" height="8" />
                  <rect x="48" y="38" width="8" height="8" />
                  <rect x="10" y="38" width="8" height="8" />
                  <rect x="24" y="48" width="8" height="8" />
                  <rect x="38" y="52" width="8" height="8" />
                  <rect x="52" y="52" width="8" height="8" />
                  <rect x="70" y="40" width="8" height="8" />
                  <rect x="84" y="48" width="8" height="8" />
                  <rect x="40" y="72" width="8" height="8" />
                  <rect x="54" y="72" width="8" height="8" />
                  <rect x="40" y="84" width="8" height="8" />
                  <rect x="72" y="72" width="8" height="8" />
                  <rect x="84" y="84" width="8" height="8" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-orange-500 text-white font-black text-[9px] px-1 rounded shadow">R</span>
                </div>
              </div>

              <div>
                <p className="font-extrabold text-white text-[11px]">Scan to Order</p>
                <p className="text-[9px] text-amber-400 italic">Good Food Better Moments</p>
              </div>
            </motion.div>

            {/* FOREGROUND RIGHT DEVICE: SMARTPHONE MOCKUP (Customer QR Mobile View) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="absolute -bottom-10 -right-2 sm:-right-4 z-30 w-48 sm:w-52 bg-black border-4 border-slate-700/80 rounded-[32px] p-2 shadow-2xl text-left overflow-hidden"
            >
              {/* Notch */}
              <div className="w-16 h-3 bg-slate-900 rounded-b-xl mx-auto mb-1.5" />

              {/* Phone Header Banner */}
              <div className="bg-gradient-to-r from-amber-950 to-orange-950 p-2 rounded-xl border border-orange-500/20 text-center space-y-0.5">
                <p className="text-[8px] uppercase tracking-widest text-amber-400 font-extrabold">THE GOOD FOOD</p>
                <p className="font-bold text-white text-[10px]">Delicious Food At Your Table</p>
                <p className="text-[8px] text-slate-400">Scan · Order · Enjoy</p>
              </div>

              {/* Phone Menu Horizontal Category Tabs */}
              <div className="flex gap-1 overflow-x-auto py-1.5 text-[8px] font-bold no-scrollbar">
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full shrink-0">Popular</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full shrink-0">Starters</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full shrink-0">Main Course</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full shrink-0">Desserts</span>
              </div>

              {/* Dish Items List */}
              <div className="space-y-1.5 py-1 text-[9px]">
                <div className="bg-slate-900 p-1.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Margherita Pizza</p>
                    <p className="text-amber-400 font-semibold text-[8px]">₹299</p>
                  </div>
                  <button className="bg-orange-500 text-white h-5 w-5 rounded-lg flex items-center justify-center font-bold">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="bg-slate-900 p-1.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Paneer Tikka</p>
                    <p className="text-amber-400 font-semibold text-[8px]">₹279</p>
                  </div>
                  <button className="bg-orange-500 text-white h-5 w-5 rounded-lg flex items-center justify-center font-bold">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="bg-slate-900 p-1.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Chicken Biryani</p>
                    <p className="text-amber-400 font-semibold text-[8px]">₹349</p>
                  </div>
                  <button className="bg-orange-500 text-white h-5 w-5 rounded-lg flex items-center justify-center font-bold">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="bg-slate-900 p-1.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Pasta Alfredo</p>
                    <p className="text-amber-400 font-semibold text-[8px]">₹299</p>
                  </div>
                  <button className="bg-orange-500 text-white h-5 w-5 rounded-lg flex items-center justify-center font-bold">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Floating Mobile Cart Bar */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-1.5 text-center text-[9px] font-extrabold shadow-lg mt-1">
                View Cart (2) · ₹578
              </div>
            </motion.div>

            {/* BOTTOM FLOATING KITCHEN ORDER ALERT BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-8 left-1/3 z-40 bg-[#161b26]/95 border border-orange-500/30 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3 hidden sm:flex"
            >
              <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <UtensilsCrossed className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Kitchen Orders</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>Real-time order tracking</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Handwritten Cursive Callout with Arrow */}
            <div className="absolute -bottom-20 right-0 z-40 hidden xl:flex flex-col items-end">
              <span className="font-handwriting text-2xl text-amber-300 font-bold max-w-[200px] text-right leading-tight drop-shadow-md">
                More Tables Happier Customers Higher Revenue
              </span>
              <svg className="w-16 h-12 text-amber-400 -mt-2 -mr-4 transform rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20,20 Q60,10 80,70" strokeLinecap="round" />
                <path d="M70,60 L80,70 L90,55" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

          </div>

        </div>

        {/* ================= BOTTOM PARTNER LOGO BAR & SCROLL ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-28 pt-10 border-t border-white/10 text-center space-y-8"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            TRUSTED BY RESTAURANTS OF ALL SIZES
          </p>

          {/* Restaurant Partner Logos Grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-400 font-extrabold opacity-75 text-sm md:text-base">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs border border-slate-600 rounded-full p-1">❇</span>
              <span>SpiceHub</span>
              <span className="text-[9px] font-normal block text-slate-500">RESTAURANT</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🍷</span>
              <div>
                <span className="block text-sm">The Food Corner</span>
                <span className="text-[8px] font-mono text-slate-500">EST. 2018</span>
              </div>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs bg-slate-800 p-1 rounded">📦</span>
              <span>Urban Bites</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🔥</span>
              <span className="tracking-widest uppercase">TANDOOR TALES</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🍛</span>
              <span>The Curry House</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🏭</span>
              <span className="uppercase">FLAVOR FACTORY</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🏰</span>
              <div>
                <span>Mezbaan</span>
                <span className="text-[8px] font-mono text-slate-500 block">INDIAN CUISINE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">🍔</span>
              <span>Bite & Beyond</span>
            </div>
          </div>

          {/* Mouse Scroll Indicator */}
          <div className="pt-6 flex flex-col items-center gap-2 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">
            <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-1.5 bg-orange-400 rounded-full"
              />
            </div>
            <span>SCROLL TO EXPLORE</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

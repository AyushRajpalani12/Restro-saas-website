"use client";

import React from "react";
import { TrendingUp, Zap, Clock, ShieldCheck } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      label: "Table Turnover Increase",
      value: "+35%",
      subtext: "Faster order placement & automated ticket dispatching",
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    {
      label: "Platform Commission",
      value: "0%",
      subtext: "100% of your earnings go straight to your account",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Average Customer Checkout",
      value: "< 2 Min",
      subtext: "Scan table QR, select addons, and confirm order",
      icon: Clock,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Live System Uptime",
      value: "99.99%",
      subtext: "WebSocket real-time sync with failover fallback",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80 shadow-xs relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{stat.label}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{stat.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

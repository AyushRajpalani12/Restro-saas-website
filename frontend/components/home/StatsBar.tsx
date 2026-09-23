"use client";

import React from "react";
import { motion } from "framer-motion";
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
      label: "POS Commission Fee",
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
    <section className="py-14 bg-white border-y border-slate-200/80 shadow-xs relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{stat.label}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{stat.subtext}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

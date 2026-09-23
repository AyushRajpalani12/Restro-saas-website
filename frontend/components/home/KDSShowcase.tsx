"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Bell, Check, Clock, Sparkles } from "lucide-react";

export default function KDSShowcase() {
  const [tickets, setTickets] = useState([
    { id: "TICK-101", table: "04", items: ["2x Paneer Tikka Masala", "3x Garlic Butter Naan"], status: "PENDING", time: "1 min ago" },
    { id: "TICK-100", table: "12", items: ["1x Woodfired Pepperoni Pizza", "2x Chilled Mojito"], status: "PREPARING", time: "4 mins ago" },
    { id: "TICK-099", table: "07", items: ["1x Chicken Biryani Special", "1x Raita"], status: "READY", time: "7 mins ago" },
  ]);

  return (
    <section id="kds" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-400 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-rose-500/30"
            >
              <ChefHat className="h-3.5 w-3.5 text-rose-400" /> Kitchen Display System (KDS)
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
            >
              Kitchen Operations Without Paper Delays
            </motion.h2>

            <p className="text-slate-400 text-base font-medium leading-relaxed">
              Eliminate handwritten order slips and kitchen noise. When a customer scans a table QR and places an order, the KDS screen chimes instantly with ticket details.
            </p>

            <div className="space-y-3 pt-2 text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Check className="h-4 w-4" />
                </div>
                <span>Automated audio chime plays when new ticket arrives</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Check className="h-4 w-4" />
                </div>
                <span>Color-coded ticket timers (Pending, Preparing, Ready)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Check className="h-4 w-4" />
                </div>
                <span>1-Tap status updates send alerts to floor staff</span>
              </div>
            </div>
          </div>

          {/* Right KDS Screen Mockup */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-extrabold text-white">LIVE KITCHEN LINE</span>
              </div>
              <span className="text-slate-400 font-mono">Chime Audio: Enabled 🔔</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border ${
                    t.status === "PENDING"
                      ? "bg-slate-900 border-rose-500/50"
                      : t.status === "PREPARING"
                      ? "bg-slate-900 border-amber-500/50"
                      : "bg-slate-900 border-emerald-500/50"
                  } space-y-3`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white text-xs">TABLE #{t.table}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        t.status === "PENDING"
                          ? "bg-rose-500/20 text-rose-400"
                          : t.status === "PREPARING"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-medium">
                    {t.items.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.time}
                    </span>
                    <button
                      onClick={() => {
                        setTickets((prev) =>
                          prev.map((tk) =>
                            tk.id === t.id
                              ? { ...tk, status: tk.status === "PENDING" ? "PREPARING" : "READY" }
                              : tk
                          )
                        );
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-1 rounded cursor-pointer"
                    >
                      Advance Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

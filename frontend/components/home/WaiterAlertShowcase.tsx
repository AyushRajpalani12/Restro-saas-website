"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Check, ShieldCheck, Clock } from "lucide-react";

export default function WaiterAlertShowcase() {
  const [calls, setCalls] = useState([
    { id: "C-1", table: "08", request: "Water Refill & Napkins", time: "Just now" },
    { id: "C-2", table: "15", request: "Printed Bill Request", time: "2 mins ago" },
  ]);

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Panel Showcase */}
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Floor Staff Assistance Console</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Real-Time Table Notifications</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Live Receiver Active
              </span>
            </div>

            <div className="space-y-3">
              {calls.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center font-medium">
                  No pending service calls. All tables attended!
                </p>
              ) : (
                calls.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center"
                  >
                    <div className="space-y-1">
                      <span className="text-orange-600 font-black text-xs">TABLE #{c.table}</span>
                      <p className="text-xs font-extrabold text-slate-900">{c.request}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Clock className="h-3 w-3" /> {c.time}
                      </p>
                    </div>
                    <button
                      onClick={() => setCalls((prev) => prev.filter((item) => item.id !== c.id))}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Clear Alert
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200"
            >
              <BellRing className="h-3.5 w-3.5 text-blue-600" /> Waiter Alert Engine
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
            >
              Zero Customer Frustration, Faster Service Response
            </motion.h2>

            <p className="text-slate-600 text-base font-medium leading-relaxed">
              Diners no longer need to wave hands across a crowded restaurant. A single tap on their phone sends instant audio chimes and table notifications to waiter tablets.
            </p>

            <div className="space-y-3 pt-2 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>Water refills, extra cutlery, or bill requests in 1 tap</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>Audible alert sound plays on waiter smart devices</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>Clear table alerts once service is delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

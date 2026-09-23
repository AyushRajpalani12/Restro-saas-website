"use client";

import React from "react";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export default function QROrderingFlow() {
  const steps = [
    {
      num: "01",
      title: "Scan Table QR",
      desc: "Customer opens phone camera and scans the table's unique QR code. No app download needed.",
      icon: QrCode,
      tag: "Instant Access",
    },
    {
      num: "02",
      title: "Browse Visual Menu",
      desc: "Interactive menu with food categories, portion choices, addon popups, and veg/non-veg tags.",
      icon: Smartphone,
      tag: "Rich Content",
    },
    {
      num: "03",
      title: "Customize & Pay",
      desc: "Diners apply promo coupon codes, choose payment method, and confirm order directly.",
      icon: Layers,
      tag: "Zero Errors",
    },
    {
      num: "04",
      title: "Instant Kitchen Dispatch",
      desc: "Order chimes on the kitchen KDS screen immediately with table number and instructions.",
      icon: CheckCircle2,
      tag: "Real-time Sync",
    },
  ];

  return (
    <section id="qr-ordering" className="py-24 bg-white border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider"
          >
            Digital Dining Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Seamless Contactless Table Ordering
          </motion.h2>
          <p className="text-slate-600 text-base font-medium">
            How your guests order food in under 2 minutes without waiting for a waiter to take notes.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative hover:shadow-xl hover:bg-white hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300">{step.num}</span>
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-black text-slate-900 mt-3 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center text-xs font-bold text-orange-600">
                  <span>Step {step.num} Complete</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

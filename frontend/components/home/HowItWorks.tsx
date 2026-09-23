"use client";

import React from "react";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Utensils, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Register & Print Table QRs",
      description:
        "Create your restaurant tenant account, configure your menu categories, and auto-generate QR codes for each table.",
      icon: QrCode,
      color: "from-orange-500 to-amber-500",
    },
    {
      number: "02",
      title: "Diners Scan & Select",
      description:
        "Customers scan table QR with their phone camera, customize dishes with addons/portions, apply coupons, and confirm.",
      icon: Smartphone,
      color: "from-rose-500 to-orange-500",
    },
    {
      number: "03",
      title: "Kitchen Cooks & Staff Serves",
      description:
        "Orders chime immediately on the KDS kitchen line. Waiters receive ready alerts to deliver piping hot meals.",
      icon: Utensils,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider"
          >
            3-Step Workflow
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            How Restro SaaS Works
          </motion.h2>
          <p className="text-slate-600 text-base font-medium">
            Get your restaurant up and running with contactless QR dining in under 10 minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-slate-200">{step.number}</span>
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">{step.title}</h3>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-20">
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

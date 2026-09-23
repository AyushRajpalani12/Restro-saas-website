"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter Plan",
      desc: "Perfect for single outlets starting with QR ordering.",
      price: annual ? "$24" : "$29",
      period: "/month",
      popular: false,
      features: [
        "1 Restaurant Outlet",
        "Up to 15 Tables with QR Codes",
        "Digital Menu Management",
        "Kitchen KDS Screen Access",
        "Basic Sales Reports",
        "Email Support",
      ],
      cta: "Start Free Trial",
      href: "/register?plan=starter",
    },
    {
      name: "Professional Plan",
      desc: "Ideal for growing restaurants seeking full automation.",
      price: annual ? "$64" : "$79",
      period: "/month",
      popular: true,
      features: [
        "3 Restaurant Outlets",
        "Unlimited Tables & QR Codes",
        "Kitchen KDS + Waiter Alert Chimes",
        "Coupon Engine & Discount Codes",
        "Staff Credentials & Role Management",
        "Real-Time Revenue Analytics",
        "Priority 24/7 Support",
      ],
      cta: "Start Free Trial",
      href: "/register?plan=pro",
    },
    {
      name: "Enterprise Plan",
      desc: "For multi-chain restaurant franchises & large operations.",
      price: annual ? "$119" : "$149",
      period: "/month",
      popular: false,
      features: [
        "Unlimited Restaurant Outlets",
        "Custom Domain & White-label Branding",
        "Multi-Branch Centralized Admin Node",
        "API Access & Custom POS Integration",
        "Dedicated Account Manager",
        "99.99% SLA Uptime Guarantee",
      ],
      cta: "Contact Enterprise",
      href: "/register?plan=enterprise",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider"
          >
            Simple & Transparent Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Flexible Plans for Every Restaurant
          </motion.h2>
          <p className="text-slate-600 text-base font-medium">
            No hidden commissions. No surprise setup fees. Cancel or upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl mt-6 border border-slate-200">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !annual ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                annual ? "bg-orange-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Annual Billing
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? "bg-slate-900 text-white border-2 border-orange-500 shadow-2xl shadow-orange-500/15 scale-105"
                  : "bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}

              <div>
                <h3 className={`text-xl font-extrabold ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-2 font-medium ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.desc}
                </p>

                <div className="my-6">
                  <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-xs font-bold ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200/20">
                  <p className={`text-xs font-black uppercase tracking-wider ${plan.popular ? "text-orange-400" : "text-orange-600"}`}>
                    Included Features:
                  </p>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold">
                      <Check className={`h-4 w-4 shrink-0 ${plan.popular ? "text-orange-400" : "text-orange-600"}`} />
                      <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/20">
                <Link
                  href={plan.href}
                  className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                  <Zap className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

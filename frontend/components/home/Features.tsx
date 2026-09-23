"use client";

import React from "react";
import {
  Smartphone,
  ChefHat,
  BellRing,
  Building2,
  Ticket,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const featuresList = [
    {
      icon: Smartphone,
      title: "QR Code Table Ordering",
      description:
        "Customers scan their unique table QR code, browse rich visual menus, customize portions/addons, apply promo codes, and place orders directly.",
      badge: "Customer Delight",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    {
      icon: ChefHat,
      title: "Live Kitchen Line (KDS)",
      description:
        "Dedicated chef screen updating order tickets in real time. Automatic chime audio alert plays whenever a new kitchen ticket arrives.",
      badge: "Kitchen Speed",
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
    {
      icon: BellRing,
      title: "Instant Waiter Alerts",
      description:
        "Diners can request water refills, napkins, or staff assistance with one tap. Floor staff get instant high-pitch bell notifications with table numbers.",
      badge: "Zero Delay",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      icon: Building2,
      title: "Multi-Tenant Branch Control",
      description:
        "Manage multiple restaurant branches, distinct table numbers, staff roles, and custom domain slugs under one central admin node.",
      badge: "Enterprise Grade",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    {
      icon: Ticket,
      title: "Coupons & Discounts Engine",
      description:
        "Create promotional percentage or flat discounts, cap minimum spend limits, set expiration dates, and drive repeat customer visits.",
      badge: "Revenue Boost",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      icon: BarChart3,
      title: "Real-Time Sales Analytics",
      description:
        "Track daily revenue metrics, top-selling dishes, peak dining hours, table turnover rates, and average fulfillment speeds with instant charts.",
      badge: "Data Driven",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Powerful Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Engineered for Modern Dining & High-Volume Kitchens
          </h2>
          <p className="text-slate-600 text-base font-medium leading-relaxed">
            Everything your restaurant needs to boost table turnover, reduce order entry mistakes, and elevate guest satisfaction.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {featuresList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-sm font-medium mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore module</span>
                  <CheckCircle2 className="h-4 w-4 ml-1 text-orange-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

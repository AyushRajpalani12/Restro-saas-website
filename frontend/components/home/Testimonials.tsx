"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Chef Vikram Malhotra",
      role: "Head Chef & Co-Owner",
      restaurant: "Urban Spice Bistro, Mumbai",
      quote:
        "The KDS kitchen screen changed everything for us. Our kitchen noise dropped by 70%, and food orders reach the prep line within 1 second of customers scanning the QR code!",
      rating: 5,
    },
    {
      name: "Ananya Sharma",
      role: "General Manager",
      restaurant: "The Olive Grove Cafe, Bengaluru",
      quote:
        "Table turnover during weekend dinner rushes increased by 40%. Customers love being able to call waiters for refill water with one tap instead of flagging staff down across a crowded room.",
      rating: 5,
    },
    {
      name: "Rohan Kapoor",
      role: "Operations Director",
      restaurant: "Tandoori Flames (4 Locations), Delhi",
      quote:
        "Managing multi-outlet menus and coupon offers from one dashboard is seamless. Restro SaaS has zero commissions, which saved us over ₹2.5 Lakhs in POS vendor fees this quarter.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Restaurant Success Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Loved by Chefs &amp; Restaurateurs
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Here&apos;s what dining industry leaders say about switching to Restro SaaS.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-orange-200 mb-3" />

                <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                  &quot;{rev.quote}&quot;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{rev.role}</p>
                  <p className="text-[10px] text-orange-600 font-bold">{rev.restaurant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

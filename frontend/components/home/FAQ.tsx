"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do customers need to download an app to order?",
      a: "No! Customers simply open their smartphone camera, scan the QR code on their table, and the digital menu opens instantly in their web browser. Zero downloads required.",
    },
    {
      q: "Does Restro SaaS work on existing iPad/Android tablets?",
      a: "Yes. Restro SaaS is 100% web-responsive. You can run the Kitchen KDS line and Waiter Alert console on any tablet, laptop, or desktop browser.",
    },
    {
      q: "Can I manage multiple outlets with different menus?",
      a: "Absolutely. Multi-tenant node architecture lets you set up distinct outlets, branch tables, category items, and staff credentials from a unified dashboard.",
    },
    {
      q: "How does the Kitchen Display System (KDS) notify chefs?",
      a: "When a customer places an order, WebSockets instantly push the ticket to the kitchen screen. An audible chime sound alerts cooks immediately.",
    },
    {
      q: "Are there any hidden transaction fees or commissions?",
      a: "None. We charge zero per-order commission fees. You keep 100% of your restaurant sales revenue.",
    },
    {
      q: "How fast can we set up our restaurant?",
      a: "You can create your account, upload menu items, and generate printable table QR codes in under 10 minutes.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white border-y border-slate-200 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Got Questions? We've Got Answers.
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Everything you need to know about setting up Restro SaaS for your restaurant.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 font-extrabold text-slate-900 flex justify-between items-center gap-4 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-orange-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 pt-4 animate-in fade-in-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

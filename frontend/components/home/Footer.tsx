"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand info */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-lg shadow-md shadow-orange-500/20">
              R
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              Restro<span className="text-orange-600">SaaS</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The multi-tenant dining operating system for contactless QR ordering, real-time Kitchen KDS lines, and floor waiter management.
          </p>
        </div>

        {/* Col 2: Product Links */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-4">
            Platform Capabilities
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <a href="#features" className="hover:text-orange-600 transition-colors">
                QR Table Ordering
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-600 transition-colors">
                Kitchen KDS Line
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-600 transition-colors">
                Waiter Service Alerts
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-600 transition-colors">
                Multi-Branch Tenant Node
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-600 transition-colors">
                Coupons & Discounts Engine
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link href="/login" className="hover:text-orange-600 transition-colors">
                Console Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-orange-600 transition-colors">
                Request Restaurant Access
              </Link>
            </li>
            <li>
              <a href="#pricing" className="hover:text-orange-600 transition-colors">
                Subscription Plans
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-orange-600 transition-colors">
                Support & FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust / Security */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-4">
            System Reliability
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
            Built with MERN Stack + Next.js 15, TanStack Query, Zustand, Socket.io, and MongoDB Atlas.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
        <p>© {new Date().getFullYear()} Restro SaaS Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for modern hospitality.
        </p>
      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight block">
              Restro<span className="text-orange-600">SaaS</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block -mt-1">
              Dining OS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-orange-600 transition-colors">
            Features
          </a>
          <a href="#interactive-demo" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            Live Demo <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          </a>
          <a href="#how-it-works" className="hover:text-orange-600 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-orange-600 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-orange-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 hover:text-orange-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            Request Access
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-orange-600 rounded-xl hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 font-semibold text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-orange-600"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-orange-600 flex items-center gap-1.5"
            >
              Live Interactive Demo <Sparkles className="h-4 w-4 text-amber-500" />
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-orange-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-orange-600"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-orange-600"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center font-bold text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-2.5 rounded-xl shadow-md"
            >
              Request Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

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
          ? "bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-indigo-500 text-white font-black text-xl shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <span className="font-extrabold text-white text-xl tracking-tight block">
              Restro<span className="text-orange-500">SaaS</span>
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block -mt-1">
              Dining OS
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#features" className="hover:text-orange-400 transition-colors">
            Features
          </a>
          <a href="#qr-ordering" className="hover:text-orange-400 transition-colors">
            QR Ordering
          </a>
          <a href="#kds" className="hover:text-orange-400 transition-colors">
            Kitchen KDS
          </a>
          <a href="#interactive-demo" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            Live Demo
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          </a>
          <a href="#pricing" className="hover:text-orange-400 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-orange-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all flex items-center gap-1.5 active:scale-95"
          >
            Start Free Trial
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#090d16]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 shadow-2xl space-y-4"
          >
            <nav className="flex flex-col gap-3 font-semibold text-slate-200">
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400"
              >
                Features
              </a>
              <a
                href="#qr-ordering"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400"
              >
                QR Ordering
              </a>
              <a
                href="#kds"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400"
              >
                Kitchen KDS
              </a>
              <a
                href="#interactive-demo"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400 flex items-center gap-1.5"
              >
                Live Interactive Demo <Sparkles className="h-4 w-4 text-amber-400" />
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-orange-400"
              >
                FAQ
              </a>
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center font-bold text-slate-200 py-2.5 rounded-xl border border-white/10 hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-2.5 rounded-xl shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

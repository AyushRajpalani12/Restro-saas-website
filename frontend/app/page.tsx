import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Store, Sparkles, ChefHat, BellRing, Smartphone, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[200px] pointer-events-none" />

      {/* Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-900/60 backdrop-blur-xl bg-slate-950/20 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl shadow-lg shadow-orange-500/10">
            R
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">Restro SaaS</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold px-4 py-2 rounded-lg shadow-md transition-all active:scale-[0.97]"
          >
            Request Access
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 text-center space-y-8 z-10 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Next Gen QR Code Ordering
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
          Modernise your Dining with <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Restro SaaS</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
          The ultimate multi-tenant platform for restaurant menus, instant QR table ordering, live kitchen line KDS screens, and real-time waiter helpers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-transform"
          >
            Request Access
            <Store className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 py-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            Login to Console
            <ShieldCheck className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full pt-16">
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl text-left space-y-3.5 backdrop-blur-xl">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">QR Table Ordering</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Customers scan their table QR, customize dishes with addons/portions, validate discount codes, and order instantly.
            </p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl text-left space-y-3.5 backdrop-blur-xl">
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <ChefHat className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Kitchen Line (KDS)</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Chef screen updating cooking tickets in real-time. Sound chimes play automatically when a new food request arrives.
            </p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl text-left space-y-3.5 backdrop-blur-xl">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <BellRing className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Waiter Helpers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Waiters get instant ping signals when customers request assistance. Clear requests and track table occupancies on the fly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-950 py-6 text-center text-xs text-slate-500 z-10 bg-slate-950/60 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Restro SaaS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

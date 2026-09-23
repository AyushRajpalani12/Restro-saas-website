"use client";

import React, { useState } from "react";
import { Smartphone, ChefHat, BellRing, BarChart3, Plus, ShoppingBag, Check, Sparkles } from "lucide-react";

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"menu" | "kitchen" | "waiter" | "admin">("menu");

  // Simulated state for cart & orders in demo
  const [cartCount, setCartCount] = useState(2);
  const [demoOrders, setDemoOrders] = useState([
    { id: "ORD-901", table: "04", items: "2x Paneer Tikka, 1x Coke", status: "PENDING", time: "1 min ago" },
    { id: "ORD-900", table: "12", items: "1x Chicken Biryani, 2x Naan", status: "PREPARING", time: "5 mins ago" },
  ]);
  const [waiterAlerts, setWaiterAlerts] = useState([
    { id: "W-1", table: "08", type: "Water & Napkins", time: "Just now" },
    { id: "W-2", table: "02", type: "Bill Request", time: "2 mins ago" },
  ]);

  return (
    <section id="interactive-demo" className="py-24 bg-white border-y border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Interactive Live Sandbox
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Experience the Ecosystem in Action
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Click between the role views below to simulate how customers, kitchen staff, waiters, and managers interact seamlessly.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "menu"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Smartphone className="h-4 w-4" /> 1. Customer QR Menu
          </button>
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "kitchen"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ChefHat className="h-4 w-4" /> 2. Kitchen KDS Line
          </button>
          <button
            onClick={() => setActiveTab("waiter")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "waiter"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BellRing className="h-4 w-4" /> 3. Waiter Call Center
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "admin"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> 4. Admin Dashboard
          </button>
        </div>

        {/* Sandbox Screen Showcase Container */}
        <div className="mt-8 bg-slate-900 rounded-3xl p-4 md:p-8 border border-slate-800 shadow-2xl min-h-[480px] flex flex-col justify-between text-white">
          {/* Top Bar inside mockup */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Simulated Environment: {activeTab.toUpperCase()} MODE</span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Tenant ID: RESTRO-DEMO-01</span>
          </div>

          {/* TAB 1: CUSTOMER QR MENU VIEW */}
          {activeTab === "menu" && (
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Spice Garden Bistro</h3>
                    <p className="text-xs text-orange-400 font-semibold">Table #04 (Dine-in QR)</p>
                  </div>
                  <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-bold">
                    Pure Veg Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">Paneer Butter Masala</h4>
                      <p className="text-xs text-slate-400">Creamy gravy with cottage cheese</p>
                      <p className="text-sm font-extrabold text-orange-400 mt-2">₹320</p>
                    </div>
                    <button
                      onClick={() => setCartCount((c) => c + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl font-bold cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">Garlic Butter Naan</h4>
                      <p className="text-xs text-slate-400">Clay oven tandoor baked</p>
                      <p className="text-sm font-extrabold text-orange-400 mt-2">₹60</p>
                    </div>
                    <button
                      onClick={() => setCartCount((c) => c + 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl font-bold cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Drawer Preview */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-orange-400" /> Your Order Basket
                  </h4>
                  <span className="bg-orange-500 text-white text-xs font-black h-5 w-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>1x Paneer Butter Masala</span>
                    <span className="font-bold">₹320</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2x Garlic Butter Naan</span>
                    <span className="font-bold">₹120</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newOrd = {
                      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
                      table: "04",
                      items: `${cartCount}x Selected Menu Dishes`,
                      status: "PENDING",
                      time: "Just now",
                    };
                    setDemoOrders((prev) => [newOrd, ...prev]);
                    setActiveTab("kitchen");
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-3 rounded-xl shadow-md text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Place Instant Order (Table 04)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KITCHEN KDS VIEW */}
          {activeTab === "kitchen" && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-rose-500" /> Kitchen Display System (KDS Screen)
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live WebSocket Ticket Stream</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`p-4 rounded-2xl border ${
                      ord.status === "PENDING"
                        ? "bg-slate-950 border-orange-500/50"
                        : "bg-slate-950 border-slate-800"
                    } space-y-3`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-black text-amber-400 text-sm">TABLE #{ord.table}</span>
                        <span className="text-xs text-slate-400 ml-2 font-mono">{ord.id}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          ord.status === "PENDING"
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-white">{ord.items}</p>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">{ord.time}</span>
                      <button
                        onClick={() => {
                          setDemoOrders((prev) =>
                            prev.map((o) =>
                              o.id === ord.id
                                ? { ...o, status: o.status === "PENDING" ? "PREPARING" : "READY" }
                                : o
                            )
                          );
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        {ord.status === "PENDING" ? "Start Cooking" : "Mark Ready"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WAITER CALL VIEW */}
          {activeTab === "waiter" && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-blue-400" /> Waiter Assistance Panel
                </h3>
                <span className="text-xs text-orange-400 font-bold">Chime Audio Sync Enabled</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {waiterAlerts.length === 0 ? (
                  <p className="text-xs text-slate-500 col-span-2 text-center py-8">
                    No active table assistance calls.
                  </p>
                ) : (
                  waiterAlerts.map((w) => (
                    <div
                      key={w.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <span className="text-amber-400 font-extrabold text-sm">TABLE #{w.table}</span>
                        <p className="text-xs text-slate-200 font-semibold">{w.type}</p>
                        <p className="text-[10px] text-slate-400">{w.time}</p>
                      </div>
                      <button
                        onClick={() => setWaiterAlerts((prev) => prev.filter((a) => a.id !== w.id))}
                        className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Attend
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN DASHBOARD VIEW */}
          {activeTab === "admin" && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" /> Executive Revenue Metrics
                </h3>
                <span className="text-xs text-emerald-400 font-bold">Live Tenant Node</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold">Today&apos;s Revenue</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">₹42,850</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">+18.5% vs yesterday</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold">Orders Completed</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">128</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Avg 14 min fulfillment</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold">Active Occupied Tables</p>
                  <p className="text-2xl font-black text-orange-400 mt-1">14 / 20</p>
                  <p className="text-[10px] text-orange-500 font-bold mt-1">70% Occupancy Rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom helper text */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
            💡 This interactive sandbox uses real-time state logic to mirror how the full MERN application operates.
          </div>
        </div>
      </div>
    </section>
  );
}

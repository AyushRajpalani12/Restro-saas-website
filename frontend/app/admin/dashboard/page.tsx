"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Card from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface TopItem {
  _id: string;
  name: string;
  totalQty: number;
  totalSales: number;
}

interface MonthlyTrend {
  name: string;
  revenue: number;
  orders: number;
}

interface DashboardData {
  todayCount: number;
  todayRevenue: number;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
  topSelling: TopItem[];
  chartData: MonthlyTrend[];
}

export default function AdminDashboard() {
  const { data: response, isLoading } = useQuery<{ success: boolean; data: DashboardData }>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiFetch("/api/admin/dashboard"),
  });

  const metrics = response?.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Real-time indicators, restaurant ordering volume, and sales analysis.</p>
      </div>

      {isLoading || !metrics ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Revenue</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹{metrics.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 border border-orange-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{metrics.todayCount}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales (All Time)</p>
                  <p className="text-3xl font-bold text-emerald-500 mt-2">
                    ₹{metrics.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{metrics.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts & Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Sales Trend</h3>
                <p className="text-xs text-slate-500">Overview of paid order billing across the last 6 months.</p>
              </div>
              <div className="h-80 w-full">
                {metrics.chartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                    No sales history available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ea580c"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Top Selling Items</h3>
                <p className="text-xs text-slate-500 mb-6">Highest moving dishes in terms of quantity and value.</p>
                <div className="space-y-4">
                  {metrics.topSelling.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No order items served yet.
                    </div>
                  ) : (
                    metrics.topSelling.map((item, idx) => (
                      <div key={item._id} className="flex items-center justify-between border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20 shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.name}</p>
                            <p className="text-[10px] text-slate-500">Qty: {item.totalQty} sold</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-350">₹{item.totalSales}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

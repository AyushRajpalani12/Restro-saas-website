"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import useSocket from "@/hooks/useSocket";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  ArrowLeft,
  Loader2,
  DollarSign,
  Receipt,
  HelpCircle,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  selectedVariant?: string;
  selectedAddons: Array<{ name: string; price: number }>;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  serviceCharge?: number;
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string;
  createdAt: string;
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; tableNumber: string; orderId: string }>;
}) {
  const queryClient = useQueryClient();
  const { restaurantSlug, tableNumber, orderId } = use(params);

  // Query order details
  const { data: response, isLoading, error } = useQuery<{ success: boolean; data: Order }>({
    queryKey: ["customer", "order-tracking", orderId],
    queryFn: () => apiFetch(`/api/customer/orders/track?id=${orderId}`),
    refetchInterval: 10000, // backup poll every 10s
  });

  const order = response?.data;

  // Socket setup (joins order tracking channel)
  const socket = useSocket(undefined, orderId);

  const playTrackingChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15); // C6

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.0);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for order status updates
    socket.on("status-changed", (data: any) => {
      playTrackingChime();
      toast.success(`📢 Order Status Updated: Now ${data.status}!`, {
        icon: "🍳",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "order-tracking", orderId] });
    });

    return () => {
      socket.off("status-changed");
    };
  }, [socket, orderId, queryClient]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !response?.success || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <HelpCircle className="h-16 w-16 text-slate-800 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
        <p className="text-slate-400">We couldn&apos;t load the tracking details for this order.</p>
      </div>
    );
  }

  // Stepper calculations
  const stages = [
    { name: "Placed", desc: "Chef verifying ticket", icon: Clock },
    { name: "Preparing", desc: "Dish in chef line", icon: ChefHat },
    { name: "Ready", desc: "Served soon!", icon: BellRing },
    { name: "Completed", desc: "Enjoy your meal!", icon: CheckCircle2 },
  ];

  const getStageIndex = (status: Order["status"]) => {
    if (status === "Pending") return 0;
    if (status === "Preparing") return 1;
    if (status === "Ready") return 2;
    if (status === "Completed") return 3;
    return -1; // Cancelled
  };

  const currentStageIndex = getStageIndex(order.status);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-10 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-[140px]" />

      {/* Top Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 p-4 sticky top-0 z-30 flex items-center justify-between">
        <Link
          href={`/${restaurantSlug}/table/${tableNumber}`}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Add More Dishes
        </Link>
        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
          Table {tableNumber} Tracker
        </span>
      </header>

      {/* Main Track container */}
      <main className="max-w-xl mx-auto w-full px-4 mt-8 space-y-6 flex-1">
        
        {/* Banner */}
        <div className="text-center space-y-2 py-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xl shadow-lg shadow-orange-500/10">
            {order.status === "Completed" ? "😋" : "🍳"}
          </div>
          {order.status === "Cancelled" ? (
            <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">Order Cancelled</h2>
          ) : (
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {order.status === "Completed" ? "Order Served!" : "Tracking Order Status..."}
            </h2>
          )}
          <p className="text-xs text-slate-500 font-medium">
            Ticket ID: #{order._id.slice(-6).toUpperCase()} • Payment Status: {order.paymentStatus}
          </p>
        </div>

        {/* Stepper progress (Only if not cancelled) */}
        {order.status !== "Cancelled" && (
          <Card className="p-6 bg-slate-900/20 border border-slate-850 backdrop-blur-xl">
            <div className="relative flex flex-col gap-6">
              {/* Stepper Line */}
              <div className="absolute left-[17px] top-[14px] bottom-[14px] w-0.5 bg-slate-800" />
              
              {/* Active line filler */}
              {currentStageIndex > 0 && (
                <div
                  className="absolute left-[17px] top-[14px] w-0.5 bg-orange-500 transition-all duration-500"
                  style={{
                    height: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                  }}
                />
              )}

              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={idx} className="flex items-start gap-4 relative z-10">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isPassed
                          ? "bg-orange-500 border-orange-500 text-white shadow shadow-orange-500/10"
                          : isCurrent
                          ? "bg-slate-950 border-orange-500 text-orange-500 animate-pulse"
                          : "bg-slate-950 border-slate-800 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold transition-colors ${
                          isPassed || isCurrent ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {stage.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Order Details Invoice card */}
        <Card className="bg-slate-900/20 border border-slate-850 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-950/40 border-b border-slate-900 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-orange-500" /> Bill Summary
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Dine-in Order</span>
          </div>

          <div className="p-5 divide-y divide-slate-900 space-y-3.5">
            {/* Items */}
            <div className="space-y-3 pb-3.5">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-200">
                      {item.quantity}x {item.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Portion: {item.selectedVariant}</p>
                    )}
                    {item.selectedAddons?.length > 0 && (
                      <p className="text-[10px] text-orange-500/70 font-semibold mt-0.5">
                        + {item.selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-350 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="text-xs space-y-2 pt-3.5 text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-300">₹{order.subtotal}</span>
              </div>
              {order.cgst > 0 && (
                <div className="flex justify-between">
                  <span>Taxes (5% GST):</span>
                  <span className="font-semibold text-slate-300">₹{(order.cgst + order.sgst).toFixed(1)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-900">
                <span>Total Amount paid:</span>
                <span className="text-orange-500">₹{order.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

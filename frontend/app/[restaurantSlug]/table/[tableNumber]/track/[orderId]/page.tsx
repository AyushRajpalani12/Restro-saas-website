"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import useSocket from "@/hooks/useSocket";
import Swal from "sweetalert2";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  ArrowLeft,
  Loader2,
  Receipt,
  HelpCircle,
  Star,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";

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
  restaurantId: string;
  branchId: string;
  items: OrderItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  serviceCharge?: number;
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; tableNumber: string; orderId: string }>;
}) {
  const queryClient = useQueryClient();
  const { restaurantSlug, tableNumber, orderId } = use(params);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: `📢 Status Updated: ${data.status}`,
        showConfirmButton: false,
        timer: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "order-tracking", orderId] });
    });

    return () => {
      socket.off("status-changed");
    };
  }, [socket, orderId, queryClient]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading order tracker...</p>
        </div>
      </div>
    );
  }

  if (error || !response?.success || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 text-center text-slate-800 font-sans">
        <div className="h-16 w-16 rounded-3xl bg-orange-50 flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-orange-500 animate-bounce" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-slate-500 text-xs max-w-xs">We couldn&apos;t load the tracking details for this order.</p>
      </div>
    );
  }

  // Stepper calculations
  const stages = [
    { name: "Placed", desc: "Chef verifying ticket", icon: Clock },
    { name: "Preparing", desc: "Dish in kitchen line", icon: ChefHat },
    { name: "Ready", desc: "Serving soon!", icon: BellRing },
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col pb-10 relative overflow-hidden font-sans">
      {/* Background soft light ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-72 bg-gradient-to-b from-orange-100/50 via-amber-50/30 to-transparent pointer-events-none blur-3xl" />

      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 p-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <Link
          href={`/${restaurantSlug}/table/${tableNumber}`}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-orange-600" />
          Add More Dishes
        </Link>
        <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">
          Table {tableNumber} Tracker
        </span>
      </header>

      {/* Main Track container */}
      <main className="max-w-xl mx-auto w-full px-4 mt-6 space-y-6 flex-1 z-10">
        {/* Banner */}
        <div className="text-center space-y-2 py-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-2xl shadow-lg shadow-orange-500/20">
            {order.status === "Completed" ? "😋" : "🍳"}
          </div>
          {order.status === "Cancelled" ? (
            <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">Order Cancelled</h2>
          ) : (
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {order.status === "Completed" ? "Order Served!" : "Tracking Order Status..."}
            </h2>
          )}
          <p className="text-xs text-slate-500 font-semibold">
            Ticket ID: #{order._id.slice(-6).toUpperCase()} • Payment Status: <span className="text-slate-900 font-extrabold">{order.paymentStatus}</span>
          </p>
        </div>

        {/* Stepper progress (Only if not cancelled and not completed) */}
        {order.status !== "Cancelled" && order.status !== "Completed" && (
          <Card className="p-6 bg-white border border-slate-200/80 rounded-[28px] shadow-sm">
            <div className="relative flex flex-col gap-6">
              {/* Stepper Line */}
              <div className="absolute left-[17px] top-[14px] bottom-[14px] w-0.5 bg-slate-200" />
              
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
                      className={`h-9 w-9 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isPassed
                          ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                          : isCurrent
                          ? "bg-white border-orange-500 text-orange-600 animate-pulse shadow-md shadow-orange-500/10"
                          : "bg-slate-100 border-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-extrabold transition-colors ${
                          isPassed || isCurrent ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {stage.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Feedback Card (Only if Completed) */}
        {order.status === "Completed" && (
          <Card className="p-6 bg-white border border-orange-200/80 rounded-[28px] shadow-sm text-center space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">How was your dining experience?</h3>
              <p className="text-xs text-slate-500">
                Hey {order.customerName || "there"}, please rate your meal and service.
              </p>
            </div>

            {!feedbackSubmitted ? (
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform active:scale-[0.85] cursor-pointer"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <div className="text-left space-y-1.5">
                  <textarea
                    placeholder="Write a message or suggestion (Optional)..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none min-h-[70px]"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={async () => {
                    if (!order) return;
                    if (rating === 0) {
                      Swal.fire({
                        icon: "warning",
                        title: "Rating Required",
                        text: "Please select a star rating before submitting.",
                      });
                      return;
                    }
                    try {
                      await apiFetch("/api/customer/feedback", {
                        method: "POST",
                        body: JSON.stringify({
                          restaurantId: order.restaurantId,
                          branchId: order.branchId,
                          orderId: order._id,
                          customerName: order.customerName || "Customer",
                          customerPhone: order.customerPhone || "",
                          ratingService: rating,
                          ratingFood: rating,
                          ratingAmbiance: rating,
                          ratingOverall: rating,
                          comment: feedbackText,
                        }),
                      });
                      setFeedbackSubmitted(true);
                      Swal.fire({
                        icon: "success",
                        title: "Thank You!",
                        text: "Your feedback has been submitted successfully.",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    } catch (err: any) {
                      Swal.fire({
                        icon: "error",
                        title: "Submission Failed",
                        text: err.message || "Failed to submit feedback",
                      });
                    }
                  }}
                  className="w-full text-white font-extrabold py-3 rounded-2xl text-xs shadow-md border-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #ea580c, #f97316)`,
                    boxShadow: `0 6px 20px -4px rgba(234, 88, 12, 0.35)`,
                  }}
                >
                  Submit Review
                </Button>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-slate-900">Feedback Submitted!</p>
                  <p className="text-xs text-slate-500">
                    We appreciate your response. Have a great day!
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Order Details Invoice card */}
        <Card className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-orange-600" /> Bill Summary
            </h3>
            <span className="text-[11px] text-slate-500 font-bold">Dine-in Order</span>
          </div>

          <div className="p-5 divide-y divide-slate-100 space-y-3.5">
            {/* Items */}
            <div className="space-y-3 pb-3.5">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900">
                      {item.quantity}x {item.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Portion: {item.selectedVariant}</p>
                    )}
                    {item.selectedAddons?.length > 0 && (
                      <p className="text-[11px] text-orange-600 font-semibold mt-0.5">
                        + {item.selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="text-xs space-y-2 pt-3.5 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-extrabold text-slate-900">₹{order.subtotal}</span>
              </div>
              {order.cgst > 0 && (
                <div className="flex justify-between">
                  <span>Taxes (5% GST):</span>
                  <span className="font-extrabold text-slate-900">₹{(order.cgst + order.sgst).toFixed(1)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2.5 border-t border-slate-200">
                <span>Total Amount paid:</span>
                <span className="text-orange-600">₹{order.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

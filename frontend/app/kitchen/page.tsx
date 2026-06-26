"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import apiFetch from "@/lib/api";
import useSocket from "@/hooks/useSocket";
import { Loader2, Flame, LogOut, CheckCircle, Clock } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  selectedVariant?: string;
  selectedAddons: Array<{ name: string; price: number }>;
  status?: string;
}

interface Table {
  _id: string;
  tableNumber: string;
}

interface Order {
  _id: string;
  tableId?: Table;
  items: OrderItem[];
  status: "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function KitchenPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const branchId = (session?.user as any)?.branchId;

  // Fetch only kitchen active orders (Pending, Preparing)
  const { data: response, isLoading } = useQuery<{ success: boolean; data: Order[] }>({
    queryKey: ["kitchen", "orders"],
    queryFn: async () => {
      const res = await apiFetch("/api/admin/orders");
      // Filter only active kitchen orders
      if (res?.success) {
        res.data = res.data.filter(
          (o: Order) => o.status === "Pending" || o.status === "Preparing"
        );
      }
      return res;
    },
    refetchInterval: 15000, // Fallback poll every 15s
  });

  const orders = response?.data || [];

  // Socket integration
  const socket = useSocket(branchId);

  const playKitchenBell = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("order-received", () => {
      playKitchenBell();
      toast("🛎️ New cooking ticket received!", {
        icon: "👨‍🍳",
        style: { background: "#e11d48", color: "#fff" },
      });
      queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] });
    });

    return () => {
      socket.off("order-received");
    };
  }, [socket, queryClient]);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: (payload: { id: string; status: Order["status"] }) =>
      apiFetch("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, variables) => {
      toast.success(`Cooking ticket marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] });
      if (socket) {
        socket.emit("update-order-status", { branchId, orderId: variables.id, status: variables.status });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update cooking ticket");
    },
  });

  const handleUpdate = (id: string, status: Order["status"]) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-rose-950/20 border-b border-rose-900/20 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-rose-600/10 text-rose-500 rounded-xl border border-rose-500/20 flex items-center justify-center">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight">KITCHEN LINE MONITOR</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {session?.user?.name} Console
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      {/* Main tickets line */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 text-rose-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orders.length === 0 ? (
              <div className="md:col-span-3 text-center py-24 bg-slate-900/10 border border-slate-900/60 rounded-2xl">
                <Flame className="h-12 w-12 text-slate-800 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No active dishes to prepare. Good job!</p>
              </div>
            ) : (
              orders.map((order) => (
                <Card
                  key={order._id}
                  className={`bg-slate-900/30 border border-slate-850 backdrop-blur-xl flex flex-col justify-between overflow-hidden rounded-2xl shadow-xl ${
                    order.status === "Pending" ? "border-rose-500/30 animate-pulse-subtle" : ""
                  }`}
                >
                  {/* Ticket Header */}
                  <div className="p-4 bg-slate-950/40 border-b border-slate-900 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Table {order.tableId?.tableNumber || "N/A"}</h3>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Ticket: #{order._id.slice(-5).toUpperCase()} • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        order.status === "Pending"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items List (Checklist style for chefs) */}
                  <div className="p-5 flex-1 space-y-4">
                    {order.items.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-3 cursor-pointer group select-none text-slate-350 hover:text-slate-200"
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 rounded bg-slate-950 border-slate-800 text-rose-600 focus:ring-rose-500/25 h-4 w-4"
                        />
                        <div className="text-sm">
                          <p className="font-bold text-slate-200 group-hover:text-white transition-colors">
                            {item.quantity}x {item.name}
                          </p>
                          {item.selectedVariant && (
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              Portion: {item.selectedVariant}
                            </p>
                          )}
                          {item.selectedAddons?.length > 0 && (
                            <p className="text-[10px] text-rose-500/80 font-semibold mt-0.5">
                              + {item.selectedAddons.map((a) => a.name).join(", ")}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Ticket Actions */}
                  <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex gap-2">
                    {order.status === "Pending" ? (
                      <Button
                        onClick={() => handleUpdate(order._id, "Preparing")}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/5 active:scale-[0.98]"
                      >
                        <Flame className="h-4 w-4" />
                        Start Cooking
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpdate(order._id, "Ready")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/5 active:scale-[0.98]"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Ready
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

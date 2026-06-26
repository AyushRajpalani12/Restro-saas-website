"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import apiFetch from "@/lib/api";
import useSocket from "@/hooks/useSocket";
import {
  BellRing,
  CheckCircle,
  TableProperties,
  LogOut,
  User,
  Loader2,
  Clock,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

interface Table {
  _id: string;
  tableNumber: string;
  seatingCapacity: number;
  status: "available" | "occupied" | "reserved";
}

interface AssistanceCall {
  id: string;
  tableNumber: string;
  time: string;
}

export default function StaffPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const branchId = (session?.user as any)?.branchId;

  const [assistanceCalls, setAssistanceCalls] = useState<AssistanceCall[]>([]);

  // Fetch branch tables
  const { data: response, isLoading } = useQuery<{ success: boolean; tables: Table[] }>({
    queryKey: ["staff", "tables"],
    queryFn: () => apiFetch("/api/admin/tables"),
  });

  const tables = response?.tables || [];

  // Socket setup
  const socket = useSocket(branchId);

  const playStaffBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for waiter calls
    socket.on("waiter-called", (data: any) => {
      playStaffBeep();
      toast(`🛎️ Table ${data.tableNumber} needs assistance!`, {
        icon: "💁",
        duration: 6000,
      });

      // Add to state if not already in list
      setAssistanceCalls((prev) => {
        if (prev.some((c) => c.tableNumber === data.tableNumber)) return prev;
        return [
          {
            id: Math.random().toString(),
            tableNumber: data.tableNumber,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.off("waiter-called");
    };
  }, [socket]);

  const clearCall = (tableNum: string) => {
    setAssistanceCalls((prev) => prev.filter((c) => c.tableNumber !== tableNum));
    toast.success(`Cleared assistance call for Table ${tableNum}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/60 border-b border-slate-900 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20 flex items-center justify-center">
            <BellRing className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight">FLOOR SERVICE DASHBOARD</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Terminal: {session?.user?.name}
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

      {/* Main Floor area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Table Assistance alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BellRing className="h-4 w-4 text-orange-500 animate-bounce" />
              Service Requests
            </h2>
            <span className="text-xs bg-slate-905 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-semibold">
              {assistanceCalls.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {assistanceCalls.length === 0 ? (
              <Card className="p-6 text-center bg-slate-900/10 border border-slate-900/60 rounded-xl">
                <HelpCircle className="h-10 w-10 text-slate-800 mx-auto mb-2" />
                <p className="text-slate-500 text-xs">No active service alerts from tables.</p>
              </Card>
            ) : (
              assistanceCalls.map((call) => (
                <Card
                  key={call.id}
                  className="p-4 bg-orange-650/5 border border-orange-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-left duration-200"
                >
                  <div>
                    <h3 className="text-base font-bold text-white">Table {call.tableNumber}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> Requested at {call.time}
                    </p>
                  </div>
                  <Button
                    onClick={() => clearCall(call.tableNumber)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 h-auto flex items-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Resolved
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Floor Map / Table List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-slate-900 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TableProperties className="h-4 w-4 text-orange-500" />
              Dining Floor Map
            </h2>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tables.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                  No tables registered on floor map.
                </div>
              ) : (
                tables.map((table) => (
                  <Card
                    key={table._id}
                    className={`p-5 rounded-2xl flex flex-col justify-between items-center text-center border relative ${
                      table.status === "available"
                        ? "bg-slate-900/10 border-slate-900"
                        : table.status === "occupied"
                        ? "bg-orange-500/5 border-orange-500/30"
                        : "bg-blue-500/5 border-blue-500/30"
                    }`}
                  >
                    <span
                      className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border mb-4 ${
                        table.status === "available"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : table.status === "occupied"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {table.status}
                    </span>

                    <div>
                      <h3 className="text-2xl font-black text-white">Table {table.tableNumber}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                        Seats: {table.seatingCapacity}
                      </p>
                    </div>

                    <div className="w-full mt-4 flex justify-center pt-3 border-t border-slate-900/60">
                      {assistanceCalls.some((c) => c.tableNumber === table.tableNumber) && (
                        <span className="text-[10px] text-orange-500 font-extrabold flex items-center gap-1.5 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                          Needs Help!
                        </span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

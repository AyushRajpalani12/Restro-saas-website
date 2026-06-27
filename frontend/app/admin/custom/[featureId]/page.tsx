"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Zap, ChevronLeft, Calendar, ShieldCheck, Box } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

export default function CustomFeaturePage() {
  const params = useParams();
  const router = useRouter();
  const featureId = params.featureId as string;

  const { data: restaurantResponse } = useQuery<{ success: boolean; data: { name: string } }>({
    queryKey: ["admin", "restaurant-info"],
    queryFn: () => apiFetch("/api/admin/restaurant-info"),
  });

  const restaurantName = restaurantResponse?.data?.name || "Restaurant";
  const featureName = featureId
    ? featureId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Custom Feature";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="bg-slate-900 hover:bg-slate-850 p-2 rounded-xl text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Zap className="h-7 w-7 text-orange-500" /> {featureName}
          </h1>
          <p className="text-slate-400 mt-1">Custom SaaS Module for {restaurantName}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
            <ShieldCheck className="h-8 w-8 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-white">Active Module</p>
              <p className="text-xs text-slate-400 leading-normal">
                This custom feature is configured, verified, and enabled on your active subscription plan.
              </p>
            </div>
          </div>

          <div className="border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Module Workspace</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Welcome to the workspace for <span className="text-white font-semibold">{featureName}</span>. This module is dynamically configured from the Super Admin panel.
            </p>
            <div className="h-48 rounded-xl bg-slate-950/60 border border-slate-850 border-dashed flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
              <Box className="h-8 w-8 text-slate-600 animate-bounce" />
              Custom workspace for {featureName}.
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Module Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-850">
                <span className="text-slate-400">Module Status</span>
                <span className="font-semibold text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-850">
                <span className="text-slate-400">Module ID</span>
                <span className="font-semibold text-slate-300 font-mono">{featureId}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-2.5">
                <span className="text-slate-400">Last Synced</span>
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Just now
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              toast.success("Module settings updated");
            }}
            className="w-full bg-slate-900 hover:bg-slate-855 text-slate-300 border border-slate-850 mt-6 rounded-xl cursor-pointer"
          >
            Reset Module Workspace
          </Button>
        </Card>
      </div>
    </div>
  );
}

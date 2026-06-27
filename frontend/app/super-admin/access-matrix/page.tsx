"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Loader2, ShieldCheck, Check, X, Zap } from "lucide-react";
import Card from "@/components/ui/card";
import toast from "react-hot-toast";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
}

const AVAILABLE_FEATURES = [
  { id: "orders", label: "Live Orders Management", description: "Real-time kitchen order tickets & tracking" },
  { id: "menu", label: "Menu & Categories Builder", description: "Manage categories, dishes, variants, & addons" },
  { id: "qr-tables", label: "Tables & QR Generator", description: "Create physical tables and QR signs" },
  { id: "coupons", label: "Coupons & Discounts", description: "Manage coupon codes & discounts" },
  { id: "staff", label: "Staff Credentials", description: "Kitchen, Staff, Cashier, & Manager accounts" },
];

export default function AccessMatrixPage() {
  const queryClient = useQueryClient();
  const [newFeatureName, setNewFeatureName] = useState("");
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);

  // Fetch plans
  const { data: plansData, isLoading } = useQuery<{ success: boolean; data: SubscriptionPlan[] }>({
    queryKey: ["super-admin", "plans"],
    queryFn: () => apiFetch("/api/super-admin/plans"),
  });

  const plans = plansData?.data || [];

  // Union of core features + actual plan features + locally created custom features
  const allFeatures = [...AVAILABLE_FEATURES];

  plans.forEach((plan) => {
    if (plan.features) {
      plan.features.forEach((f) => {
        if (!allFeatures.some((af) => af.id === f)) {
          allFeatures.push({
            id: f,
            label: f.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            description: "Custom SaaS Module",
          });
        }
      });
    }
  });

  customFeatures.forEach((f) => {
    if (!allFeatures.some((af) => af.id === f)) {
      allFeatures.push({
        id: f,
        label: f.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: "Custom SaaS Module",
      });
    }
  });

  // Update plan features mutation
  const updatePlanFeaturesMutation = useMutation({
    mutationFn: ({ planId, features }: { planId: string; features: string[] }) =>
      apiFetch("/api/super-admin/plans", {
        method: "PATCH",
        body: JSON.stringify({ id: planId, features }),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Access matrix updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["super-admin", "plans"] });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update matrix");
    },
  });

  const handleToggleFeature = (plan: SubscriptionPlan, featureId: string) => {
    const isEnabled = plan.features.includes(featureId);
    let newFeatures: string[];
    if (isEnabled) {
      newFeatures = plan.features.filter((f) => f !== featureId);
    } else {
      newFeatures = [...plan.features, featureId];
    }
    updatePlanFeaturesMutation.mutate({ planId: plan._id, features: newFeatures });
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName) return;

    const featId = newFeatureName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    if (!featId) return;

    if (allFeatures.some((f) => f.id === featId)) {
      toast.error("Feature already exists in matrix");
      return;
    }

    setCustomFeatures([...customFeatures, featId]);
    setNewFeatureName("");
    toast.success(`Custom module '${featId}' added to matrix!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="h-8 w-8 text-orange-500" /> System Access Matrix
          </h1>
          <p className="text-slate-400 mt-1">
            Directly map, toggle, and configure feature permissions across subscription tiers.
          </p>
        </div>
      </div>

      {/* Custom feature creation panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-orange-500" /> Create Custom Module
          </h3>
          <p className="text-[11px] text-slate-500">
            Define a new permission key (e.g. inventory-mgmt) to dynamically register a workspace.
          </p>
        </div>
        <form onSubmit={handleAddCustomFeature} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. billing-reports"
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 w-full sm:w-48 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Add Module
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <Card className="overflow-hidden border border-slate-800 bg-slate-900/20 backdrop-blur-xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/60">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[280px]">
                    SaaS Core Modules
                  </th>
                  {plans.map((plan) => (
                    <th key={plan._id} className="p-5 text-center min-w-[150px]">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-white block">{plan.name}</span>
                        <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider">
                          ${plan.price} / month
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {allFeatures.map((feature) => (
                  <tr key={feature.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-5">
                      <div className="space-y-1">
                        <span className="text-sm font-extrabold text-white">{feature.label}</span>
                        <span className="text-xs text-slate-450 block leading-normal">{feature.description}</span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const isEnabled = plan.features?.includes(feature.id);
                      return (
                        <td key={plan._id} className="p-5 text-center">
                          <button
                            onClick={() => handleToggleFeature(plan, feature.id)}
                            disabled={updatePlanFeaturesMutation.isPending}
                            className={`inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isEnabled
                                ? "bg-orange-500/10 border-orange-500/25 text-orange-400 hover:bg-orange-500/20"
                                : "bg-slate-950/40 border-slate-850 text-slate-500 hover:border-slate-800 hover:text-slate-400"
                            }`}
                          >
                            {isEnabled ? (
                              <Check className="h-5 w-5 stroke-[2.5]" />
                            ) : (
                              <X className="h-4 w-4 stroke-[2.5]" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

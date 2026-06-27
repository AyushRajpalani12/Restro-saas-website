"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { BACKEND_URL } from "@/lib/config";
import { Store, Globe, Calendar, CheckCircle, AlertTriangle, Loader2, Plus, X } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
}

interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  billingEmail: string;
  phone: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus: string;
  subscriptionEndsAt?: string;
  isActive: boolean;
  isSuspended: boolean;
  customDomain?: string;
  createdAt: string;
}

export default function RestaurantsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [editingDomainRestId, setEditingDomainRestId] = useState<string | null>(null);
  const [customDomainText, setCustomDomainText] = useState("");

  // Add Restaurant form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestName, setNewRestName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newSubscriptionPlanId, setNewSubscriptionPlanId] = useState("");
  const [addingRestaurant, setAddingRestaurant] = useState(false);

  // Edit subscription states
  const [editingPlanRestId, setEditingPlanRestId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [endsAtText, setEndsAtText] = useState("");

  useEffect(() => {
    const restaurantName = searchParams.get("restaurantName");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (restaurantName || email || phone) {
      if (restaurantName) setNewRestName(restaurantName);
      if (email) setNewAdminEmail(email);
      if (phone) setNewPhone(phone);
      setShowAddModal(true);
      
      // Clean up the URL search params so they don't persist on page refresh
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  // Fetch restaurants
  const { data: restaurantsData, isLoading } = useQuery<{ success: boolean; data: Restaurant[] }>({
    queryKey: ["super-admin", "restaurants"],
    queryFn: () => apiFetch("/api/super-admin/restaurants"),
  });

  // Fetch subscription plans
  const { data: plansData } = useQuery<{ success: boolean; data: SubscriptionPlan[] }>({
    queryKey: ["super-admin", "plans"],
    queryFn: () => apiFetch("/api/super-admin/plans"),
  });
  const plans = plansData?.data || [];

  const updateRestaurantMutation = useMutation({
    mutationFn: (updatedData: {
      id: string;
      isActive?: boolean;
      isSuspended?: boolean;
      customDomain?: string;
      subscriptionPlan?: string;
      subscriptionStatus?: string;
      subscriptionEndsAt?: string | null;
    }) =>
      apiFetch("/api/super-admin/restaurants", {
        method: "PATCH",
        body: JSON.stringify(updatedData),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Tenant status updated");
        queryClient.invalidateQueries({ queryKey: ["super-admin", "restaurants"] });
        setEditingDomainRestId(null);
        setEditingPlanRestId(null);
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update tenant");
    },
  });

  const restaurants = restaurantsData?.data || [];

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateRestaurantMutation.mutate({ id, isActive: !currentActive });
  };

  const handleToggleSuspend = (id: string, currentSuspended: boolean) => {
    updateRestaurantMutation.mutate({ id, isSuspended: !currentSuspended });
  };

  const handleUpdateDomain = (id: string) => {
    updateRestaurantMutation.mutate({ id, customDomain: customDomainText || "" });
  };

  const handleUpdatePlan = (id: string) => {
    updateRestaurantMutation.mutate({
      id,
      subscriptionPlan: selectedPlanId || "",
      subscriptionStatus: selectedStatus,
      subscriptionEndsAt: endsAtText ? new Date(endsAtText).toISOString() : null,
    });
  };

  // Add Restaurant Handler
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName || !newAdminEmail || !newAdminPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newPhone && newPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setAddingRestaurant(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName: newRestName,
          email: newAdminEmail,
          password: newAdminPassword,
          phone: newPhone,
          address: newAddress,
          subscriptionPlanId: newSubscriptionPlanId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add restaurant");
      }

      toast.success("New Restaurant registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["super-admin", "restaurants"] });
      resetAddForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to onboard restaurant");
    } finally {
      setAddingRestaurant(false);
    }
  };

  const resetAddForm = () => {
    setNewRestName("");
    setNewAdminEmail("");
    setNewAdminPassword("");
    setNewPhone("");
    setNewAddress("");
    setNewSubscriptionPlanId("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Tenants</h1>
          <p className="text-slate-400 mt-1">Supervise multi-tenant restaurant nodes, active domain mappings, and suspend access.</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="h-4 w-4" />
          Add Restaurant
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <Card className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-semibold">
                  <th className="py-4 px-6">Restaurant Name</th>
                  <th className="py-4 px-6">Contact / Email</th>
                  <th className="py-4 px-6">Subscription Plan</th>
                  <th className="py-4 px-6">Custom Domain</th>
                  <th className="py-4 px-6">Access State</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {restaurants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No tenants registered. Click &quot;Add Restaurant&quot; to onboard.
                    </td>
                  </tr>
                ) : (
                  restaurants.map((rest) => (
                    <tr key={rest._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-slate-800/80 text-orange-500 flex items-center justify-center rounded-lg border border-slate-700">
                            <Store className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{rest.name}</div>
                            <div className="text-xs text-slate-500">slug: /{rest.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>{rest.billingEmail}</div>
                        <div className="text-xs text-slate-500">{rest.phone || "No phone"}</div>
                      </td>
                      <td className="py-4 px-6">
                        {editingPlanRestId === rest._id ? (
                          <div className="flex flex-col gap-2 max-w-[180px]">
                            {/* Plan Selection */}
                            <select
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-orange-500 w-full"
                              value={selectedPlanId}
                              onChange={(e) => setSelectedPlanId(e.target.value)}
                            >
                              <option value="">No Plan</option>
                              {plans.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>

                            {/* Status Selection */}
                            <select
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-orange-500 w-full"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                              <option value="trialing">Trialing</option>
                              <option value="active">Active</option>
                              <option value="past_due">Past Due</option>
                              <option value="canceled">Canceled</option>
                            </select>

                            {/* Ends At Input */}
                            <input
                              type="date"
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-orange-500 w-full"
                              value={endsAtText}
                              onChange={(e) => setEndsAtText(e.target.value)}
                            />

                            {/* Save/Cancel Buttons */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-1 h-auto"
                                onClick={() => handleUpdatePlan(rest._id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] px-2 py-1 h-auto"
                                onClick={() => setEditingPlanRestId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 items-start group">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-slate-700">
                                {rest.subscriptionPlan?.name || "No Plan"}
                              </span>
                              <button
                                className="opacity-0 group-hover:opacity-100 text-[10px] text-orange-500 hover:underline ml-1 cursor-pointer"
                                onClick={() => {
                                  setEditingPlanRestId(rest._id);
                                  setSelectedPlanId(rest.subscriptionPlan?._id || "");
                                  setSelectedStatus(rest.subscriptionStatus || "trialing");
                                  setEndsAtText(
                                    rest.subscriptionEndsAt
                                      ? new Date(rest.subscriptionEndsAt).toISOString().split("T")[0]
                                      : ""
                                  );
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider ${
                                rest.subscriptionStatus === "active"
                                  ? "text-emerald-400"
                                  : rest.subscriptionStatus === "trialing"
                                  ? "text-amber-400"
                                  : "text-red-400"
                              }`}
                            >
                              {rest.subscriptionStatus}
                            </span>
                            {rest.subscriptionEndsAt && (
                              <span className="text-[10px] text-slate-500">
                                expires: {new Date(rest.subscriptionEndsAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingDomainRestId === rest._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-orange-500"
                              value={customDomainText}
                              onChange={(e) => setCustomDomainText(e.target.value)}
                            />
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-1 h-auto"
                              onClick={() => handleUpdateDomain(rest._id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] px-2 py-1 h-auto"
                              onClick={() => setEditingDomainRestId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 group">
                            <Globe className="h-3.5 w-3.5 text-slate-500" />
                            <span>{rest.customDomain || "None"}</span>
                            <button
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-orange-500 hover:underline ml-1 cursor-pointer"
                              onClick={() => {
                                setEditingDomainRestId(rest._id);
                                setCustomDomainText(rest.customDomain || "");
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(rest._id, rest.isActive)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            rest.isActive ? "bg-emerald-500" : "bg-slate-800"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              rest.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button
                          size="sm"
                          className={`${
                            rest.isSuspended
                              ? "bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border border-amber-500/20"
                              : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                          } text-xs font-semibold px-3 py-1.5`}
                          onClick={() => handleToggleSuspend(rest._id, rest.isSuspended)}
                        >
                          {rest.isSuspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Restaurant Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Register Restaurant Tenant
              </h2>
              <button onClick={resetAddForm} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddRestaurant} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Input
                label="Restaurant Name *"
                type="text"
                placeholder="The Italian Bistro"
                value={newRestName}
                onChange={(e) => setNewRestName(e.target.value)}
                required
                disabled={addingRestaurant}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Owner/Admin Email *"
                  type="email"
                  placeholder="admin@bistro.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  disabled={addingRestaurant}
                />
                <Input
                  label="Password *"
                  type="password"
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  disabled={addingRestaurant}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 99999 88888"
                value={newPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setNewPhone(val);
                  }
                }}
                disabled={addingRestaurant}
              />

              <Textarea
                label="Address"
                placeholder="456 Main Street, Suite A"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                disabled={addingRestaurant}
                rows={3}
              />

              <Select
                label="Initial Subscription Plan"
                value={newSubscriptionPlanId}
                onChange={(e) => setNewSubscriptionPlanId(e.target.value)}
                options={[
                  { value: "", label: "Trial Plan (Default)" },
                  ...plans.map((p) => ({ value: p._id, label: `${p.name} ($${p.price})` })),
                ]}
                disabled={addingRestaurant}
              />

              <div className="text-[10px] text-slate-500 font-semibold">
                * Fields are required. Creating a restaurant will automatically generate a default branch and setup an admin login credentials record.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <Button
                  type="button"
                  onClick={resetAddForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  disabled={addingRestaurant}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingRestaurant}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2"
                >
                  {addingRestaurant && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Restaurant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

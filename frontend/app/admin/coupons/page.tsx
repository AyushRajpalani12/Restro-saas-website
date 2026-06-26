"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Plus, Trash2, Loader2, Ticket, Percent, Calendar } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  endDate: string;
  isActive: boolean;
}

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [endDate, setEndDate] = useState("");

  // Queries
  const { data: response, isLoading } = useQuery<{ success: boolean; data: Coupon[] }>({
    queryKey: ["admin", "coupons"],
    queryFn: () => apiFetch("/api/admin/coupons"),
  });

  const coupons = response?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/coupons", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete coupon");
    },
  });

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(0);
    setMinOrderValue(0);
    setEndDate("");
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue || !endDate) return;
    createMutation.mutate({ code, discountType, discountValue, minOrderValue, endDate });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this discount coupon? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Coupons & Offers</h1>
          <p className="text-slate-400 mt-1">Configure customer marketing discounts, flat price slashes, or percentage offers.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
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
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-6">Discount</th>
                  <th className="py-4 px-6">Min Order Value</th>
                  <th className="py-4 px-6">Validity</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No coupon campaigns active. Click &quot;Create Coupon&quot; to define a discount code.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-orange-500 tracking-wider">
                        {coupon.code}
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% Off`
                          : `₹${coupon.discountValue} Flat`}
                      </td>
                      <td className="py-4 px-6 text-slate-200">
                        ₹{coupon.minOrderValue}
                      </td>
                      <td className="py-4 px-6 text-slate-400 flex items-center gap-1.5 mt-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        Valid till: {new Date(coupon.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-1.5 text-red-500 hover:text-red-400 transition-colors bg-red-950/20 rounded border border-red-950/40 hover:border-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-orange-500" />
                Define Coupon Offer
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Coupon Code *"
                type="text"
                placeholder="SAVEMORE30"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Discount Type *"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  options={[
                    { value: "percentage", label: "Percentage (%)" },
                    { value: "flat", label: "Flat (₹)" },
                  ]}
                  required
                />
                <Input
                  label="Discount Value *"
                  type="number"
                  placeholder="30"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Order (₹)"
                  type="number"
                  placeholder="100"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                />
                <Input
                  label="End Date *"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

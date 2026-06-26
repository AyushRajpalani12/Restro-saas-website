"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Settings, Save, Loader2, DollarSign, BellRing, Printer, Sparkles } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";

interface SettingsData {
  currency: string;
  cgstRate: number;
  sgstRate: number;
  serviceChargeRate: number;
  deliveryChargeRate: number;
  enableSoundAlerts: boolean;
  tableCallOption: boolean;
  thermalPrinterWidth: string;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();

  // Form states
  const [currency, setCurrency] = useState("INR");
  const [cgstRate, setCgstRate] = useState(2.5);
  const [sgstRate, setSgstRate] = useState(2.5);
  const [serviceChargeRate, setServiceChargeRate] = useState(0);
  const [deliveryChargeRate, setDeliveryChargeRate] = useState(0);
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [tableCallOption, setTableCallOption] = useState(true);
  const [thermalPrinterWidth, setThermalPrinterWidth] = useState("80mm");

  // Fetch settings
  const { data: response, isLoading } = useQuery<{ success: boolean; data: SettingsData }>({
    queryKey: ["admin", "settings"],
    queryFn: () => apiFetch("/api/admin/settings"),
  });

  // Populate form once data is loaded
  useEffect(() => {
    if (response?.data) {
      const s = response.data;
      setCurrency(s.currency || "INR");
      setCgstRate(s.cgstRate ?? 2.5);
      setSgstRate(s.sgstRate ?? 2.5);
      setServiceChargeRate(s.serviceChargeRate ?? 0);
      setDeliveryChargeRate(s.deliveryChargeRate ?? 0);
      setEnableSoundAlerts(s.enableSoundAlerts ?? true);
      setTableCallOption(s.tableCallOption ?? true);
      setThermalPrinterWidth(s.thermalPrinterWidth || "80mm");
    }
  }, [response]);

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: SettingsData) =>
      apiFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save settings");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      currency,
      cgstRate,
      sgstRate,
      serviceChargeRate,
      deliveryChargeRate,
      enableSoundAlerts,
      tableCallOption,
      thermalPrinterWidth,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Branch Settings</h1>
        <p className="text-slate-400 mt-1">Configure localized tax percentages, receipts billing structure, and terminal helpers.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          {/* Card 1: Localisation & Currency */}
          <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Currency & Localisation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Currency Token *"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: "INR", label: "Indian Rupee (₹)" },
                  { value: "USD", label: "US Dollar ($)" },
                  { value: "EUR", label: "Euro (€)" },
                  { value: "GBP", label: "British Pound (£)" },
                ]}
                required
              />
            </div>
          </Card>

          {/* Card 2: Taxes & Service Charges */}
          <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Taxes & Charges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="CGST Rate (%) *"
                type="number"
                step="0.01"
                value={cgstRate}
                onChange={(e) => setCgstRate(Number(e.target.value))}
                required
              />
              <Input
                label="SGST Rate (%) *"
                type="number"
                step="0.01"
                value={sgstRate}
                onChange={(e) => setSgstRate(Number(e.target.value))}
                required
              />
              <Input
                label="Service Charge (%)"
                type="number"
                step="0.01"
                value={serviceChargeRate}
                onChange={(e) => setServiceChargeRate(Number(e.target.value))}
              />
              <Input
                label="Delivery Charge (₹)"
                type="number"
                step="0.1"
                value={deliveryChargeRate}
                onChange={(e) => setDeliveryChargeRate(Number(e.target.value))}
              />
            </div>
          </Card>

          {/* Card 3: Operation Features */}
          <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BellRing className="h-5 w-5 text-orange-500" />
              Terminal Operational Flags
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="soundCheck"
                  checked={enableSoundAlerts}
                  onChange={(e) => setEnableSoundAlerts(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20 h-4 w-4"
                />
                <div>
                  <label htmlFor="soundCheck" className="text-sm font-semibold text-slate-200 cursor-pointer">
                    Enable Sound Alerts
                  </label>
                  <p className="text-[10px] text-slate-500">Waiter call and new order alerts play sound triggers on staff screens.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="helperCheck"
                  checked={tableCallOption}
                  onChange={(e) => setTableCallOption(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20 h-4 w-4"
                />
                <div>
                  <label htmlFor="helperCheck" className="text-sm font-semibold text-slate-200 cursor-pointer">
                    Allow &apos;Call Waiter&apos; assistance
                  </label>
                  <p className="text-[10px] text-slate-500">Customers can trigger waiters request flags directly from their QR scanned menus.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 4: Printer settings */}
          <Card className="p-6 bg-slate-900/30 border border-slate-800 backdrop-blur-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Printer className="h-5 w-5 text-orange-500" />
              Thermal Bill Print Layout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Thermal Printer Paper Size *"
                value={thermalPrinterWidth}
                onChange={(e) => setThermalPrinterWidth(e.target.value)}
                options={[
                  { value: "80mm", label: "80mm Width (Standard POS)" },
                  { value: "58mm", label: "58mm Width (Handheld POS)" },
                ]}
                required
              />
            </div>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 py-3 px-8 shadow-lg shadow-orange-500/10"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              Save Branch Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

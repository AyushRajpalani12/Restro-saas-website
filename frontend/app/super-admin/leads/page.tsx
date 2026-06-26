"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { BACKEND_URL } from "@/lib/config";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
  Mail,
  User,
  Phone,
  CheckCircle,
  ExternalLink,
  Calendar,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

interface Lead {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  message?: string;
  status: "Pending" | "Contacted" | "Onboarded" | "Rejected";
  createdAt: string;
}

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; msg: string } | null>(null);

  // Fetch leads
  const { data: leadsData, isLoading, error } = useQuery<{ success: boolean; data: Lead[] }>({
    queryKey: ["super-admin", "leads"],
    queryFn: () => apiFetch("/api/super-admin/leads"),
  });

  // Update lead status
  const updateStatusMutation = useMutation({
    mutationFn: (updated: { id: string; status: string }) =>
      apiFetch("/api/super-admin/leads", {
        method: "PATCH",
        body: JSON.stringify(updated),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Lead status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["super-admin", "leads"] });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update lead status");
    },
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/super-admin/leads/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Lead deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["super-admin", "leads"] });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete lead");
    },
  });

  const leads = leadsData?.data || [];

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleOnboardRedirect = (lead: Lead) => {
    // 1. Mark status as Contacted
    if (lead.status === "Pending") {
      updateStatusMutation.mutate({ id: lead._id, status: "Contacted" });
    }
    // 2. Redirect to restaurants page with pre-populated URL params
    const params = new URLSearchParams({
      restaurantName: lead.restaurantName,
      email: lead.email,
      phone: lead.phone,
    });
    router.push(`/super-admin/restaurants?${params.toString()}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Onboarded":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Contacted":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Leads & Inquiries</h1>
        <p className="text-slate-400 mt-1">
          Review restaurant setup interest, manage inquiry status, and onboard prospective tenants.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : error ? (
        <Card className="p-8 border border-red-500/20 bg-red-500/5 text-center text-red-400">
          Failed to load lead inquiries. Make sure the backend server is running.
        </Card>
      ) : (
        <Card className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-semibold">
                  <th className="py-4 px-6">Restaurant Details</th>
                  <th className="py-4 px-6">Contact / Person</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Requirements</th>
                  <th className="py-4 px-6">Inquiry Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No customer leads captured yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">
                        {lead.restaurantName}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {lead.ownerName}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="h-3.5 w-3.5 text-slate-500" />
                            <a href={`mailto:${lead.email}`} className="hover:underline hover:text-orange-500 font-sans">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Phone className="h-3.5 w-3.5 text-slate-500" />
                            <a href={`tel:${lead.phone}`} className="hover:underline hover:text-orange-500">
                              {lead.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(lead.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {lead.message ? (
                          <button
                            onClick={() => setSelectedMessage({ name: lead.restaurantName, msg: lead.message || "" })}
                            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded-md border border-slate-700 transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            View Message
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs">No message</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative inline-block w-40">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            className={`w-full appearance-none cursor-pointer rounded-lg text-xs font-semibold py-1.5 pl-3 pr-8 outline-none transition-all ${getStatusStyle(
                              lead.status
                            )}`}
                          >
                            <option value="Pending" className="bg-slate-950 text-slate-200">Pending</option>
                            <option value="Contacted" className="bg-slate-950 text-slate-200">Contacted</option>
                            <option value="Onboarded" className="bg-slate-950 text-slate-200">Onboarded</option>
                            <option value="Rejected" className="bg-slate-950 text-slate-200">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleOnboardRedirect(lead)}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 inline-flex items-center gap-1"
                        >
                          Onboard
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete lead for ${lead.restaurantName}?`)) {
                              deleteLeadMutation.mutate(lead._id);
                            }
                          }}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold px-2 py-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* View Message Modal Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Inquiry: {selectedMessage.name}
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/60 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.msg}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setSelectedMessage(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

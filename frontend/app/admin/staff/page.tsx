"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Plus, Trash2, Loader2, UserCheck, ShieldAlert, KeyRound } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  // Queries
  const { data: response, isLoading } = useQuery<{ success: boolean; data: StaffMember[] }>({
    queryKey: ["admin", "staff"],
    queryFn: () => apiFetch("/api/admin/staff"),
  });

  const staff = response?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/staff", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Staff registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create staff member");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/staff?id=${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Staff access removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete staff member");
    },
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    createMutation.mutate({ name, email, password, role });
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove login credentials and access for this staff member?")) {
      deleteMutation.mutate(id);
    }
  };

  const roleLabels: Record<string, string> = {
    BRANCH_MANAGER: "Branch Manager",
    KITCHEN: "Kitchen / Chef",
    STAFF: "Waiter / Service Staff",
    CASHIER: "Cashier",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Credentials</h1>
          <p className="text-slate-400 mt-1">Manage team access codes, branch manager logs, and service terminals.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="h-4 w-4" />
          Add Staff
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
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No staff members registered. Click &quot;Add Staff&quot; to authorize a terminal.
                    </td>
                  </tr>
                ) : (
                  staff.map((member) => (
                    <tr key={member._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-2.5">
                        <UserCheck className="h-4 w-4 text-orange-500" />
                        {member.name}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{member.email}</td>
                      <td className="py-4 px-6 font-medium text-slate-200">
                        <span className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
                          {roleLabels[member.role] || member.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-semibold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(member._id)}
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

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-orange-500" />
                Register Staff Access
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Full Name *"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="chef.john@gourmet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Access Password *"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Select
                label="Role Designation *"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "STAFF", label: "Waiter / Service Staff" },
                  { value: "KITCHEN", label: "Kitchen / Chef" },
                  { value: "CASHIER", label: "Cashier" },
                  { value: "BRANCH_MANAGER", label: "Branch Manager" },
                ]}
                required
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Register Staff
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

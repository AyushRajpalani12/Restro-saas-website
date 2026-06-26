"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Plus, Edit2, Trash2, Loader2, Tags, ToggleLeft, ToggleRight } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Queries
  const { data: response, isLoading } = useQuery<{ success: boolean; data: Category[] }>({
    queryKey: ["admin", "categories"],
    queryFn: () => apiFetch("/api/admin/categories"),
  });

  const categories = response?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/categories", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete category");
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setSortOrder(0);
    setIsActive(true);
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setSortOrder(cat.sortOrder);
    setIsActive(cat.isActive);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description, sortOrder, isActive };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Categories</h1>
          <p className="text-slate-400 mt-1">Organize your menu courses (e.g. Starters, Main Course, Drinks).</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="h-4 w-4" />
          Add Category
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
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Sort Order</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No categories created yet. Click &quot;Add Category&quot; to begin.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-2.5">
                        <Tags className="h-4 w-4 text-orange-500" />
                        {cat.name}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{cat.description || "N/A"}</td>
                      <td className="py-4 px-6 font-medium text-slate-200">{cat.sortOrder}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            cat.isActive ? "text-emerald-400" : "text-slate-500"
                          }`}
                        >
                          {cat.isActive ? (
                            <>
                              <ToggleRight className="h-5 w-5 text-emerald-500" />
                              Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-5 w-5 text-slate-600" />
                              Disabled
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-850 rounded border border-slate-800 hover:border-slate-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Category Name *"
                type="text"
                placeholder="Starters"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Appetizers, soups, and fingers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Input
                label="Sort Order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20"
                />
                <label htmlFor="isActiveCheck" className="text-sm text-slate-300 font-medium">
                  Category is active and visible on customer menu
                </label>
              </div>

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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  UtensilsCrossed,
  Image,
  Upload,
  Layers,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

interface Variant {
  _id?: string;
  name: string;
  price: number;
}

interface Addon {
  _id?: string;
  name: string;
  price: number;
}

interface MenuItem {
  _id: string;
  categoryId: Category;
  name: string;
  description?: string;
  price: number;
  images: string[];
  foodType: "veg" | "non-veg" | "egg";
  spicyLevel: number;
  preparationTime?: number;
  calories?: number;
  isRecommended: boolean;
  isPopular: boolean;
  isOutOfStock: boolean;
  isActive: boolean;
  variants: Variant[];
  addons: Addon[];
}

export default function MenuPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [foodType, setFoodType] = useState<"veg" | "non-veg" | "egg">("veg");
  const [spicyLevel, setSpicyLevel] = useState(0);
  const [preparationTime, setPreparationTime] = useState(15);
  const [calories, setCalories] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  // Variants & Addons states
  const [variants, setVariants] = useState<Variant[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  // Temp input states for adding variant/addon
  const [varName, setVarName] = useState("");
  const [varPrice, setVarPrice] = useState(0);
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState(0);

  // Queries
  const { data: menuResponse, isLoading: menuLoading } = useQuery<{ success: boolean; data: MenuItem[] }>({
    queryKey: ["admin", "menu"],
    queryFn: () => apiFetch("/api/admin/menu"),
  });

  const { data: catResponse, isLoading: catLoading } = useQuery<{ success: boolean; data: Category[] }>({
    queryKey: ["admin", "categories"],
    queryFn: () => apiFetch("/api/admin/categories"),
  });

  const menuItems = menuResponse?.data || [];
  const categories = catResponse?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/menu", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Menu item created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "menu"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create menu item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/menu", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Menu item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "menu"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update menu item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/menu?id=${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Menu item deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "menu"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete item");
    },
  });

  // Handle Image upload using Multer multipart/form-data
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "menu");

    setImageUploading(true);

    try {
      const uploadRes = await apiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.success) {
        setImageUrl(uploadRes.url);
        toast.success("Image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const addVariant = () => {
    if (!varName) return;
    setVariants([...variants, { name: varName, price: varPrice }]);
    setVarName("");
    setVarPrice(0);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const addAddon = () => {
    if (!addName) return;
    setAddons([...addons, { name: addName, price: addPrice }]);
    setAddName("");
    setAddPrice(0);
  };

  const removeAddon = (index: number) => {
    setAddons(addons.filter((_, idx) => idx !== index));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setCategoryId("");
    setImageUrl("");
    setFoodType("veg");
    setSpicyLevel(0);
    setPreparationTime(15);
    setCalories(0);
    setIsRecommended(false);
    setIsPopular(false);
    setIsOutOfStock(false);
    setVariants([]);
    setAddons([]);
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price);
    setCategoryId(item.categoryId?._id || "");
    setImageUrl(item.images?.[0] || "");
    setFoodType(item.foodType);
    setSpicyLevel(item.spicyLevel);
    setPreparationTime(item.preparationTime || 15);
    setCalories(item.calories || 0);
    setIsRecommended(item.isRecommended);
    setIsPopular(item.isPopular);
    setIsOutOfStock(item.isOutOfStock);
    setVariants(item.variants.map((v) => ({ name: v.name, price: v.price })));
    setAddons(item.addons.map((a) => ({ name: a.name, price: a.price })));
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this menu item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    const payload = {
      categoryId,
      name,
      description,
      price,
      images: imageUrl ? [imageUrl] : [],
      foodType,
      spicyLevel,
      preparationTime,
      calories,
      isRecommended,
      isPopular,
      isOutOfStock,
      variants,
      addons,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Menu Items</h1>
          <p className="text-slate-400 mt-1">Manage dishes, pricing, food tags, addons, and inventories.</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            if (categories.length > 0) setCategoryId(categories[0]._id);
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {menuLoading || catLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card
              key={item._id}
              className={`bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between ${
                item.isOutOfStock ? "opacity-60" : ""
              }`}
            >
              <div>
                <div className="relative h-48 bg-slate-950 flex items-center justify-center border-b border-slate-900 overflow-hidden">
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UtensilsCrossed className="h-12 w-12 text-slate-700" />
                  )}
                  <span
                    className={`absolute top-3 left-3 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${
                      item.foodType === "veg"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : item.foodType === "non-veg"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {item.foodType}
                  </span>
                  {item.isOutOfStock && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase text-orange-500 font-bold tracking-wider">
                    {item.categoryId?.name}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 h-8">{item.description || "No description"}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-extrabold text-white">₹{item.price}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      prep: {item.preparationTime || 15}m
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-900 bg-slate-950/20 flex gap-2 justify-end">
                <Button
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-950/10 border border-red-950/30 text-red-500 hover:bg-red-950/20 px-3"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Name *"
                  type="text"
                  placeholder="Butter Chicken"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Select
                  label="Category *"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  options={categories.map((c) => ({ value: c._id, label: c.name }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number"
                  placeholder="249"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
                <Select
                  label="Food Type *"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value as any)}
                  options={[
                    { value: "veg", label: "Veg" },
                    { value: "non-veg", label: "Non-Veg" },
                    { value: "egg", label: "Egg" },
                  ]}
                  required
                />
                <Select
                  label="Spicy Level"
                  value={spicyLevel.toString()}
                  onChange={(e) => setSpicyLevel(Number(e.target.value))}
                  options={[
                    { value: "0", label: "Not Spicy" },
                    { value: "1", label: "Mild" },
                    { value: "2", label: "Medium" },
                    { value: "3", label: "Extra Hot" },
                  ]}
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Delicious slow-cooked chicken in creamy butter gravy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Image Upload Block */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Menu Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {imageUploading ? (
                      <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                    ) : imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <Image className="h-6 w-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={imageUploading}
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1.5">PNG, JPG or JPEG. Max size of 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preparation Time (min)"
                  type="number"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(Number(e.target.value))}
                />
                <Input
                  label="Calories (Kcal)"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                />
              </div>

              {/* Toggle Switches */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRecommendedCheck"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20"
                  />
                  <label htmlFor="isRecommendedCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Recommended
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPopularCheck"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20"
                  />
                  <label htmlFor="isPopularCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Chef Special / Popular
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOutOfStockCheck"
                    checked={isOutOfStock}
                    onChange={(e) => setIsOutOfStock(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500/20"
                  />
                  <label htmlFor="isOutOfStockCheck" className="text-xs text-slate-350 font-semibold text-red-500 cursor-pointer">
                    Out of Stock
                  </label>
                </div>
              </div>

              {/* Variants Section */}
              <div className="border-t border-slate-850 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" />
                  Item Variants (e.g. Size, Portions)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Regular / Half"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={varPrice || ""}
                    onChange={(e) => setVarPrice(Number(e.target.value))}
                    className="w-28 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <Button
                    type="button"
                    onClick={addVariant}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3"
                  >
                    Add
                  </Button>
                </div>
                {variants.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {variants.map((v, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-slate-850 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-250 font-semibold"
                      >
                        {v.name}: ₹{v.price}
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-400 font-bold ml-1 text-sm shrink-0"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Addons Section */}
              <div className="border-t border-slate-850 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" />
                  Item Addons (e.g. Extra Cheese, Dips)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Extra Cheese"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={addPrice || ""}
                    onChange={(e) => setAddPrice(Number(e.target.value))}
                    className="w-28 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <Button
                    type="button"
                    onClick={addAddon}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3"
                  >
                    Add
                  </Button>
                </div>
                {addons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {addons.map((a, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-slate-850 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-250 font-semibold"
                      >
                        {a.name}: ₹{a.price}
                        <button
                          type="button"
                          onClick={() => removeAddon(index)}
                          className="text-red-500 hover:text-red-400 font-bold ml-1 text-sm shrink-0"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-850">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold"
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
                  Save Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

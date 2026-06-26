"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import useCart, { CartItem } from "@/store/useCart";
import useSocket from "@/hooks/useSocket";
import {
  UtensilsCrossed,
  BellRing,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Loader2,
  Percent,
  X,
  PlusCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Variant {
  _id: string;
  name: string;
  price: number;
}

interface Addon {
  _id: string;
  name: string;
  price: number;
}

interface Category {
  _id: string;
  name: string;
}

interface MenuItem {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  foodType: "veg" | "non-veg" | "egg";
  spicyLevel: number;
  isRecommended: boolean;
  isPopular: boolean;
  isOutOfStock: boolean;
  variants: Variant[];
  addons: Addon[];
}

interface Restaurant {
  _id: string;
  name: string;
  slug: string;
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface MenuResponse {
  success: boolean;
  restaurant: Restaurant;
  theme: Theme;
  categories: Category[];
  menuItems: MenuItem[];
}

export default function TableOrderingPage({ params }: { params: Promise<{ restaurantSlug: string; tableNumber: string }> }) {
  const router = useRouter();
  const { restaurantSlug, tableNumber } = use(params);

  // Zustand cart state
  const { items, coupon, addItem, removeItem, updateQuantity, setCoupon, clearCart, setSession } = useCart();

  // Selected Category
  const [selectedCat, setSelectedCat] = useState<string>("All");

  // Filter food type
  const [filterType, setFilterType] = useState<"all" | "veg" | "non-veg">("all");

  // Customize Item Dialog Modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [instructions, setInstructions] = useState("");

  // Customer credentials dialog
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Show Cart Side Drawer
  const [cartOpen, setCartOpen] = useState(false);

  // Coupon state
  const [couponCodeText, setCouponCodeText] = useState("");
  const [couponValidationLoading, setCouponValidationLoading] = useState(false);

  // Order submission loading
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Query menu
  const { data: menuResponse, isLoading, error } = useQuery<MenuResponse>({
    queryKey: ["customer", "menu", restaurantSlug],
    queryFn: () => apiFetch(`/api/customer/menu?slug=${restaurantSlug}`),
  });

  const restaurant = menuResponse?.restaurant;
  const menuItems = menuResponse?.menuItems || [];
  const categories = menuResponse?.categories || [];
  const theme = menuResponse?.theme || { primaryColor: "#ea580c" };
  const primaryCol = theme.primaryColor || "#ea580c";

  // Establish live socket connection
  const socket = useSocket(undefined, undefined);

  useEffect(() => {
    if (restaurantSlug && tableNumber) {
      setSession(restaurantSlug, tableNumber);
    }
  }, [restaurantSlug, tableNumber, setSession]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !menuResponse?.success || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <UtensilsCrossed className="h-16 w-16 text-slate-800 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Menu Unavailable</h1>
        <p className="text-slate-400">The QR code you scanned has expired or is invalid.</p>
      </div>
    );
  }

  // Handle Waiter Request Calls
  const handleCallWaiter = () => {
    if (socket && restaurant) {
      socket.emit("call-waiter", {
        branchId: (restaurant as any).branchId || "",
        tableNumber,
      });
      toast.success("🛎️ Waiter has been called! A staff member is on their way.");
    } else {
      toast.error("Connecting to server. Please try again in a moment.");
    }
  };

  // Open item customizing options or directly add to cart
  const handleAddItemClick = (item: MenuItem) => {
    if (item.variants?.length > 0 || item.addons?.length > 0) {
      setCustomizingItem(item);
      setSelectedVariant(item.variants?.[0] || null);
      setSelectedAddons([]);
      setInstructions("");
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        selectedAddons: [],
      });
      toast.success(`Added ${item.name} to order!`);
    }
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;

    const basePrice = selectedVariant ? selectedVariant.price : customizingItem.price;
    const addonsPrice = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    const finalItemPrice = basePrice + addonsPrice;

    addItem({
      menuItemId: customizingItem._id,
      name: customizingItem.name,
      price: finalItemPrice,
      quantity: 1,
      selectedVariant: selectedVariant ? { name: selectedVariant.name, price: selectedVariant.price } : undefined,
      selectedAddons: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
      specialInstructions: instructions || undefined,
    });

    toast.success(`Customized ${customizingItem.name} added!`);
    setCustomizingItem(null);
  };

  const handleAddonToggle = (addon: Addon) => {
    if (selectedAddons.some((a) => a._id === addon._id)) {
      setSelectedAddons(selectedAddons.filter((a) => a._id !== addon._id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Validate coupon
  const handleValidateCoupon = async () => {
    if (!couponCodeText) return;
    setCouponValidationLoading(true);

    try {
      const res = await apiFetch("/api/customer/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
          restaurantId: restaurant._id,
          code: couponCodeText,
          subtotal,
        }),
      });

      if (res.success) {
        setCoupon({
          code: res.coupon.code,
          discountType: res.coupon.discountType === "percentage" ? "percentage" : "fixed",
          discountValue: res.coupon.discountValue,
          minOrderValue: res.coupon.minOrderValue,
        });
        toast.success(`Coupon applied! Saved ₹${res.discountAmount}`);
        setCouponCodeText("");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid coupon code");
    } finally {
      setCouponValidationLoading(false);
    }
  };

  // Order placing handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setSubmittingOrder(true);
    try {
      const payload = {
        restaurantId: restaurant._id,
        tableNumber,
        customerName,
        customerPhone,
        paymentMethod,
        couponCode: coupon?.code || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          selectedVariant: i.selectedVariant?.name || undefined,
          selectedAddons: i.selectedAddons.map((a) => ({ name: a.name, price: a.price })),
          specialInstructions: i.specialInstructions,
        })),
      };

      const res = await apiFetch("/api/customer/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        // Notify socket of new order
        if (socket) {
          socket.emit("new-order", {
            branchId: res.branchId,
            orderId: res.orderId,
            tableNumber,
          });
        }

        toast.success("Order placed successfully! Redirecting...");
        clearCart();
        setCartOpen(false);
        router.push(`/[restaurantSlug]/table/${tableNumber}/track/${res.orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Financial calculations
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  let discount = 0;
  if (coupon) {
    discount =
      coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  }
  const taxableAmount = Math.max(0, subtotal - discount);
  const cgst = 0; // Removed GST tax for now
  const sgst = 0; // Removed GST tax for now
  const total = taxableAmount + cgst + sgst;

  const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCat === "All" || item.categoryId === selectedCat;
    const matchesType =
      filterType === "all" ||
      (filterType === "veg" && item.foodType === "veg") ||
      (filterType === "non-veg" && item.foodType === "non-veg");
    return matchesCat && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[140px]" style={{ backgroundColor: `${primaryCol}08` }} />

      {/* Top Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 p-4 z-35 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-white text-base tracking-tight">{restaurant.name}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Seated at Table {tableNumber}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCallWaiter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
          >
            <BellRing className="h-4 w-4" />
            Call Waiter
          </button>
        </div>
      </header>

      {/* Categories & Filter layout */}
      <main className="max-w-4xl mx-auto w-full px-4 mt-6 space-y-4 flex-1">
        {/* Veg/Non-Veg Quick Toggle Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border transition-colors ${
              filterType === "all"
                ? "bg-slate-900 border-slate-800 text-white"
                : "border-transparent text-slate-500 hover:text-slate-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("veg")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 transition-colors ${
              filterType === "veg"
                ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Veg
          </button>
          <button
            onClick={() => setFilterType("non-veg")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 transition-colors ${
              filterType === "non-veg"
                ? "bg-red-950/40 border-red-900/60 text-red-400"
                : "border-transparent text-slate-500 hover:text-slate-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Non-Veg
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCat("All")}
            className={`px-4.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCat === "All"
                ? "text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-850"
            }`}
            style={{ backgroundColor: selectedCat === "All" ? primaryCol : undefined }}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const isSel = selectedCat === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCat(cat._id)}
                className={`px-4.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  isSel
                    ? "text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-850"
                }`}
                style={{ backgroundColor: isSel ? primaryCol : undefined }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {filteredItems.length === 0 ? (
            <div className="md:col-span-2 text-center py-16 text-slate-500 text-xs">
              No matching menu items found in this section.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`p-4 bg-slate-900/10 border border-slate-850 rounded-2xl flex gap-4 ${
                  item.isOutOfStock ? "opacity-60" : ""
                }`}
              >
                {/* Photo */}
                <div className="h-24 w-24 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 border border-slate-900 relative">
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <UtensilsCrossed className="h-8 w-8 text-slate-850" />
                  )}
                  <span
                    className={`absolute bottom-1.5 left-1.5 h-2 w-2 rounded-full ring-4 ring-slate-950 ${
                      item.foodType === "veg" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-extrabold text-white leading-tight">{item.name}</h3>
                      {item.isRecommended && (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] uppercase font-black px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/40">
                    <span className="text-base font-extrabold text-white">₹{item.price}</span>
                    {item.isOutOfStock ? (
                      <span className="text-[10px] text-red-500 uppercase font-black tracking-wider">Sold Out</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddItemClick(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-3 h-auto text-[10px] rounded-lg shadow shadow-orange-500/10"
                        style={{ backgroundColor: primaryCol }}
                      >
                        Add +
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalQty > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-slate-950 border-t border-slate-900 p-4 z-40 flex items-center justify-center">
          <button
            onClick={() => setCartOpen(true)}
            className="max-w-md w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-4.5 rounded-xl font-bold flex items-center justify-between shadow-xl shadow-orange-500/15 transition-transform active:scale-[0.98]"
            style={{ backgroundImage: `linear-gradient(to right, ${primaryCol}, #d97706)` }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm font-semibold">{totalQty} Item(s) Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black">₹{total}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Customise Item Modal Popup */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <div>
                <h3 className="text-base font-bold text-white">{customizingItem.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Customize portion sizes or add extras</p>
              </div>
              <button onClick={() => setCustomizingItem(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Variants Selection */}
              {customizingItem.variants?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Portion</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {customizingItem.variants.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                          selectedVariant?.name === v.name
                            ? "bg-orange-500/5 border-orange-500 text-white font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-xs">{v.name}</span>
                        <span className="text-sm font-extrabold text-white mt-1">₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons Selection */}
              {customizingItem.addons?.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add Extra Addons</h4>
                  <div className="space-y-2">
                    {customizingItem.addons.map((a) => {
                      const isSel = selectedAddons.some((addon) => addon._id === a._id);
                      return (
                        <button
                          key={a._id}
                          type="button"
                          onClick={() => handleAddonToggle(a)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                            isSel
                              ? "bg-slate-900 border-orange-500 text-white font-bold"
                              : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs">{a.name}</span>
                          <span className="text-xs font-extrabold text-slate-200">+ ₹{a.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Special Requests</label>
                <textarea
                  placeholder="Make it extra spicy / No onions..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 h-16 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-850 bg-slate-950/20">
              <Button
                onClick={handleConfirmCustomization}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1"
                style={{ backgroundColor: primaryCol }}
              >
                Add Customised Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Panel overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-black text-white">Your Bill Check</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-900/60 last:border-0 last:pb-0">
                    <div className="flex-1 text-xs space-y-1">
                      <p className="font-extrabold text-white">{item.name}</p>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-slate-500 font-semibold">Portion: {item.selectedVariant.name}</p>
                      )}
                      {item.selectedAddons?.length > 0 && (
                        <p className="text-[10px] text-orange-500/80 font-semibold">
                          + {item.selectedAddons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-slate-500 italic">Req: &quot;{item.specialInstructions}&quot;</p>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 bg-slate-950 border border-slate-850 hover:bg-slate-850 flex items-center justify-center rounded text-slate-400 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-slate-200 font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 bg-slate-950 border border-slate-850 hover:bg-slate-850 flex items-center justify-center rounded text-slate-400 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-white">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="block text-[10px] text-red-500 hover:underline mt-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon campaigns */}
              <div className="border-t border-slate-850 pt-5 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coupon Code</h4>
                {coupon ? (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-emerald-400 tracking-wider">Applied: {coupon.code}</p>
                      <p className="text-slate-500 font-medium mt-0.5">
                        Saved: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </p>
                    </div>
                    <button onClick={() => setCoupon(null)} className="text-red-500 hover:text-red-400 font-bold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCodeText}
                      onChange={(e) => setCouponCodeText(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-950 border border-slate-850 text-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                    />
                    <Button
                      onClick={handleValidateCoupon}
                      disabled={couponValidationLoading}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4"
                    >
                      {couponValidationLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Customer check Form */}
              <form onSubmit={handlePlaceOrder} id="cartPlaceOrderForm" className="border-t border-slate-850 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Your Name *"
                    placeholder="Alice Smith"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <Input
                    label="Mobile Number *"
                    placeholder="9999988888"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <Select
                  label="Select Payment Method *"
                  value={paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: "Cash", label: "Cash on Served" },
                    { value: "UPI", label: "UPI Payments (Mock)" },
                    { value: "Card", label: "Debit/Credit Card (Mock)" },
                  ]}
                  required
                />
              </form>
            </div>

            {/* Calculations & Submit */}
            <div className="p-5 border-t border-slate-850 bg-slate-950/40 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Food Items Subtotal:</span>
                  <span className="font-semibold text-slate-200">₹{subtotal}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Campaign Discount:</span>
                    <span className="font-semibold">- ₹{discount}</span>
                  </div>
                )}
                 {(cgst + sgst) > 0 && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Taxes (5% GST):</span>
                    <span className="font-semibold text-slate-200">₹{(cgst + sgst).toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-900">
                  <span>Total Amount due:</span>
                  <span className="text-base">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="cartPlaceOrderForm"
                disabled={submittingOrder || items.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-transform"
                style={{ backgroundImage: `linear-gradient(to right, ${primaryCol}, #d97706)` }}
              >
                {submittingOrder && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm & Place Order (₹{total.toFixed(0)})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

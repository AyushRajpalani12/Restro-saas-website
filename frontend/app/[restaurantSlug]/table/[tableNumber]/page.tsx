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
  branchId?: string;
  subscriptionPlan?: {
    _id: string;
    name: string;
    price: number;
    features: string[];
  };
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface SettingsData {
  currency: string;
  cgstRate: number;
  sgstRate: number;
  serviceChargeRate: number;
  deliveryChargeRate: number;
}

interface MenuResponse {
  success: boolean;
  restaurant: Restaurant;
  theme: Theme;
  categories: Category[];
  menuItems: MenuItem[];
  settings?: SettingsData;
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
    queryFn: () => apiFetch(`/api/customer/menu?slug=${restaurantSlug}&tableNumber=${tableNumber}`),
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-955 px-4 text-center text-slate-100">
        <UtensilsCrossed className="h-16 w-16 text-slate-800 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">Menu Unavailable</h1>
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
    if (customerPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
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
        router.push(`/${restaurantSlug}/table/${tableNumber}/track/${res.orderId}`);
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

  // Check if gst-billing feature is active
  const hasGstBilling = restaurant?.subscriptionPlan?.features?.includes("gst-billing");
  const cgstRate = hasGstBilling ? (menuResponse?.settings?.cgstRate ?? 2.5) : 0;
  const sgstRate = hasGstBilling ? (menuResponse?.settings?.sgstRate ?? 2.5) : 0;

  const cgst = (taxableAmount * cgstRate) / 100;
  const sgst = (taxableAmount * sgstRate) / 100;
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
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col pb-28 relative overflow-x-hidden font-sans">
      {/* Abstract custom styled micro-animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing {
          animation: swing 1.2s ease infinite alternate;
          transform-origin: top center;
        }
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Custom scrollbar hides */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Background radial abstract gradient meshes */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] max-w-[600px] rounded-full blur-[150px] opacity-[0.14] pointer-events-none" style={{ backgroundColor: primaryCol }} />
      <div className="absolute top-[40%] right-[-20%] w-[60vw] h-[60vw] max-w-[500px] rounded-full blur-[130px] opacity-[0.07] pointer-events-none" style={{ backgroundColor: "#3b82f6" }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Frosted Glass Header */}
      <header className="sticky top-0 backdrop-blur-xl bg-[#090d22]/80 border-b border-slate-800/60 px-5 py-4.5 z-30 flex items-center justify-between shadow-lg shadow-[#00000030]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
            {restaurant.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none mb-1.5">{restaurant.name}</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-emerald-450 font-black uppercase tracking-wider leading-none">
                Table {tableNumber}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCallWaiter}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
        >
          <BellRing className="h-4 w-4 text-orange-500 animate-pulse" />
          Call Waiter
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 mt-6 space-y-6 flex-1 z-10 animate-slide-up">
        
        {/* Welcome Branding Hero Card */}
        <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/20 border border-slate-800/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" style={{ color: primaryCol }} />
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Digital Dining Experience</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight leading-tight">Welcome to {restaurant.name}</h2>
              <p className="text-xs text-slate-405 leading-relaxed">Browse our menu specialties, customize toppings, and send orders directly to the kitchen.</p>
            </div>
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
              <Clock className="h-4 w-4 text-orange-400" style={{ color: primaryCol }} />
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Average Prep:</span>
              <span className="text-xs font-extrabold text-white">~ 15-20 Mins</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-b border-slate-900/40 pb-4.5">
          <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none">Dietary Preference</h3>
          <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-850 p-1 rounded-2xl shadow-inner w-full">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all duration-300 cursor-pointer text-center ${
                filterType === "all"
                  ? "bg-slate-900 text-white shadow border border-slate-800"
                  : "text-slate-500 hover:text-slate-350 border border-transparent"
              }`}
            >
              All Food
            </button>
            <button
              onClick={() => setFilterType("veg")}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer text-center ${
                filterType === "veg"
                  ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow"
                  : "text-slate-500 hover:text-slate-350 border border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Veg Only
            </button>
            <button
              onClick={() => setFilterType("non-veg")}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-305 cursor-pointer text-center ${
                filterType === "non-veg"
                  ? "bg-red-500/10 border border-red-500/25 text-red-400 shadow"
                  : "text-slate-500 hover:text-slate-350 border border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Categories Bar Scrollable */}
        <div className="relative">
          <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
            <button
              onClick={() => setSelectedCat("All")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all duration-305 cursor-pointer border ${
                selectedCat === "All"
                  ? "text-white shadow-lg shadow-orange-500/10"
                  : "bg-[#0c0f24]/50 text-slate-400 border-slate-850/60 hover:text-slate-200 hover:border-slate-800"
              }`}
              style={{
                backgroundColor: selectedCat === "All" ? primaryCol : undefined,
                borderColor: selectedCat === "All" ? primaryCol : undefined,
                boxShadow: selectedCat === "All" ? `0 8px 20px -6px ${primaryCol}40` : undefined,
              }}
            >
              🌟 All Specialties
            </button>
            {categories.map((cat) => {
              const isSel = selectedCat === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCat(cat._id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all duration-305 cursor-pointer border ${
                    isSel
                      ? "text-white shadow-lg shadow-orange-500/10"
                      : "bg-[#0c0f24]/50 text-slate-400 border-slate-850/60 hover:text-slate-200 hover:border-slate-800"
                  }`}
                  style={{
                    backgroundColor: isSel ? primaryCol : undefined,
                    borderColor: isSel ? primaryCol : undefined,
                    boxShadow: isSel ? `0 8px 20px -6px ${primaryCol}40` : undefined,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredItems.length === 0 ? (
            <div className="md:col-span-2 text-center py-20 text-slate-500 text-xs bg-slate-900/10 border border-slate-850/60 rounded-3xl backdrop-blur-sm">
              <UtensilsCrossed className="h-10 w-10 text-slate-800 mx-auto mb-3" />
              No matching menu items found in this section.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`p-4 bg-gradient-to-b from-[#0e122d]/40 to-[#070919]/60 border border-slate-855/65 hover:border-orange-500/20 rounded-[28px] flex gap-4.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#00000045] group relative ${
                  item.isOutOfStock ? "opacity-55 pointer-events-none" : ""
                }`}
              >
                {/* Photo & Food Type Emblem */}
                <div className="h-28 w-28 rounded-2xl bg-slate-955 flex items-center justify-center overflow-hidden shrink-0 border border-slate-900 relative shadow-inner">
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <UtensilsCrossed className="h-8 w-8 text-slate-850" />
                  )}
                  {/* Indian Standard food type badge (square box with a dot inside) */}
                  <span className={`absolute top-2.5 left-2.5 p-0.5 rounded bg-slate-950/85 border ${item.foodType === "veg" ? "border-emerald-500/40" : "border-red-500/40"} flex items-center justify-center h-5 w-5 backdrop-blur-sm shadow`}>
                    <span className={`h-2 w-2 rounded-full ${item.foodType === "veg" ? "bg-emerald-500" : "bg-red-500"}`} />
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-black text-white leading-snug group-hover:text-orange-400 transition-colors duration-200">{item.name}</h3>
                      {item.isRecommended && (
                        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8px] tracking-wider uppercase font-black px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1 shadow">
                          <Sparkles className="h-2 w-2" /> Reco
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 pr-1">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900/40">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">₹</span>
                      <span className="text-base font-black text-white">{item.price}</span>
                    </div>
                    {item.isOutOfStock ? (
                      <span className="text-[9px] text-red-500 uppercase font-black tracking-wider bg-red-955/20 px-2.5 py-1 rounded-lg border border-red-900/35">Sold Out</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddItemClick(item)}
                        className="text-white font-extrabold py-2 px-4.5 h-auto text-[10px] rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryCol}, ${primaryCol}dd)`,
                          boxShadow: `0 4px 14px -4px ${primaryCol}40`,
                        }}
                      >
                        Add Item +
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-8 mb-24 text-center space-y-3 z-10 border-t border-slate-900/40 pt-8 animate-slide-up">
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <UtensilsCrossed className="h-4 w-4" />
          <span className="text-[10px] uppercase font-black tracking-widest">{restaurant.name}</span>
        </div>
        <p className="text-xs text-slate-400 font-medium italic max-w-xs mx-auto leading-relaxed">
          "Good food is the foundation of genuine happiness. Prepared fresh, served with love!"
        </p>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
          Powered by Restro SaaS • Contactless Dining
        </p>
      </footer>

      {/* Floating Bottom Cart Island */}
      {totalQty > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 animate-slide-up">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-650 hover:to-amber-705 text-white p-4 rounded-2xl font-black flex items-center justify-between shadow-2xl shadow-orange-500/20 border border-orange-400/20 hover:scale-[1.01] transition-all active:scale-[0.98] cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryCol}, #d97706)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
                <ShoppingBag className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">{totalQty} {totalQty === 1 ? 'Dish' : 'Dishes'} Selected</span>
                <span className="text-[9px] text-white/80 font-semibold mt-0.5 block">View order details</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight">₹{total}</span>
              <div className="h-7 w-7 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20">
                <ArrowRight className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Customise Item Modal Popup */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <div>
                <h3 className="text-base font-bold text-white">{customizingItem.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Customize portion sizes or add extras</p>
              </div>
              <button onClick={() => setCustomizingItem(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Variants Portion Selection */}
              {customizingItem.variants?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Select Portion</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {customizingItem.variants.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedVariant?.name === v.name
                            ? "bg-orange-500/5 border-orange-500 text-white font-bold"
                            : "bg-slate-955 border-slate-850 text-slate-400 hover:text-slate-205"
                        }`}
                      >
                        <span className="text-xs">{v.name}</span>
                        <span className="text-sm font-black text-white mt-1">₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons Selection */}
              {customizingItem.addons?.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Extra Addons</h4>
                  <div className="space-y-2">
                    {customizingItem.addons.map((a) => {
                      const isSel = selectedAddons.some((addon) => addon._id === a._id);
                      return (
                        <button
                          key={a._id}
                          type="button"
                          onClick={() => handleAddonToggle(a)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSel
                              ? "bg-slate-900 border-orange-500 text-white font-bold"
                              : "bg-slate-955 border-slate-850 text-slate-400 hover:text-slate-205"
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
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Special Requests</label>
                <textarea
                  placeholder="Make it extra spicy / No onions / Less salt..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-855 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500 h-20 resize-none transition-colors"
                />
              </div>
            </div>

            <div className="p-4.5 border-t border-slate-855 bg-slate-950/20">
              <Button
                onClick={handleConfirmCustomization}
                className="w-full text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/5 cursor-pointer"
                style={{ backgroundColor: primaryCol }}
              >
                Add Customised Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Panel Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-955/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-l border-slate-805 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-955/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-black text-white">Your Bill Check</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 text-slate-405 hover:text-white transition-colors cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 pb-4.5 border-b border-slate-900/60 last:border-0 last:pb-0">
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
                          className="h-6 w-6 bg-slate-955 border border-slate-850 hover:bg-slate-850 flex items-center justify-center rounded text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-slate-200 font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 bg-slate-955 border border-slate-850 hover:bg-slate-850 flex items-center justify-center rounded text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-white">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="block text-[10px] text-red-500 hover:underline mt-1 cursor-pointer font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="border-t border-slate-850 pt-5 space-y-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Coupon Code</h4>
                {coupon ? (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-black text-emerald-400 tracking-wider">Applied: {coupon.code}</p>
                      <p className="text-slate-500 font-medium mt-0.5">
                        Saved: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </p>
                    </div>
                    <button onClick={() => setCoupon(null)} className="text-red-500 hover:text-red-400 font-bold cursor-pointer">
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
                      className="flex-1 bg-slate-955 border border-slate-850 text-slate-205 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <Button
                      onClick={handleValidateCoupon}
                      disabled={couponValidationLoading}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-4 rounded-xl cursor-pointer"
                    >
                      {couponValidationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Customer input details form */}
              <form onSubmit={handlePlaceOrder} id="cartPlaceOrderForm" className="border-t border-slate-850 pt-5 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Details</h4>
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
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) {
                        setCustomerPhone(val);
                      }
                    }}
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

            {/* Calculations & Submit placement */}
            <div className="p-5 border-t border-slate-850 bg-slate-955/40 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Food Items Subtotal:</span>
                  <span className="font-semibold text-slate-205">₹{subtotal}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Discount Code Applied:</span>
                    <span className="font-semibold">- ₹{discount}</span>
                  </div>
                )}
                {cgst > 0 && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>CGST ({cgstRate}%):</span>
                    <span className="font-semibold text-slate-205">₹{cgst.toFixed(1)}</span>
                  </div>
                )}
                {sgst > 0 && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>SGST ({sgstRate}%):</span>
                    <span className="font-semibold text-slate-205">₹{sgst.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2.5 border-t border-slate-900">
                  <span>Total Amount due:</span>
                  <span className="text-base font-black">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="cartPlaceOrderForm"
                disabled={submittingOrder || items.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
                style={{ backgroundImage: `linear-gradient(to right, ${primaryCol}, #d97706)` }}
              >
                {submittingOrder && <Loader2 className="h-4 w-4 animate-spin animate-pulse" />}
                Confirm & Place Order (₹{total.toFixed(0)})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import useCart from "@/store/useCart";
import useSocket from "@/hooks/useSocket";
import Swal from "sweetalert2";
import {
  UtensilsCrossed,
  BellRing,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Loader2,
  X,
  Clock,
  ArrowRight,
  User,
  Phone,
  KeyRound,
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  Receipt,
  Tag,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
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
  const {
    items,
    coupon,
    addItem,
    removeItem,
    updateQuantity,
    setCoupon,
    clearCart,
    setSession,
    customerName: verifiedName,
    customerPhone: verifiedPhone,
    isVerified,
    setCustomerDetails,
  } = useCart();

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

  // Phone verification gateway states
  const [verificationStep, setVerificationStep] = useState<"details" | "otp">("details");
  const [tempName, setTempName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

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

  useEffect(() => {
    if (isVerified && verifiedName && verifiedPhone) {
      setCustomerName(verifiedName);
      setCustomerPhone(verifiedPhone);
    }
  }, [isVerified, verifiedName, verifiedPhone]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !menuResponse?.success || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 text-center text-slate-800 font-sans">
        <div className="h-16 w-16 rounded-3xl bg-orange-50 flex items-center justify-center mb-4">
          <UtensilsCrossed className="h-8 w-8 text-orange-500 animate-bounce" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Menu Unavailable</h1>
        <p className="text-slate-500 text-sm max-w-xs">The QR code you scanned has expired or is invalid.</p>
      </div>
    );
  }

  // If customer is not verified, render the verification gateway screen
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30 text-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Soft background ambient gradient meshes */}
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[500px] rounded-full blur-[140px] opacity-[0.25] pointer-events-none" style={{ backgroundColor: primaryCol }} />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] max-w-[400px] rounded-full blur-[120px] opacity-[0.2] pointer-events-none" style={{ backgroundColor: "#3b82f6" }} />

        <div className="w-full max-w-md z-10 space-y-6 animate-fade-in">
          {/* Header/Logo area */}
          <div className="text-center space-y-2">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white font-extrabold text-3xl shadow-xl shadow-orange-500/20 select-none transition-transform hover:scale-105"
              style={{ backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)` }}
            >
              {restaurant.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight pt-2">
              Welcome to {restaurant.name}
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Please verify your mobile number to view our menu and place orders directly from Table {tableNumber}.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 border border-slate-200/80 backdrop-blur-xl rounded-[32px] p-7 shadow-xl shadow-slate-200/60">
            {verificationStep === "details" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tempName || !tempPhone) {
                    Swal.fire({
                      icon: "warning",
                      title: "Missing Fields",
                      text: "Please fill in all required fields",
                      confirmButtonColor: primaryCol,
                    });
                    return;
                  }
                  if (tempPhone.length !== 10) {
                    Swal.fire({
                      icon: "warning",
                      title: "Invalid Number",
                      text: "Phone number must be exactly 10 digits",
                      confirmButtonColor: primaryCol,
                    });
                    return;
                  }
                  setVerifyingOtp(true);
                  setTimeout(() => {
                    setVerifyingOtp(false);
                    setVerificationStep("otp");
                    Swal.fire({
                      icon: "info",
                      title: "🔑 Demo Mode OTP",
                      html: "Use verification code <b style='color:#ea580c;font-size:1.1em;'>123456</b> to proceed.",
                      confirmButtonColor: primaryCol,
                    });
                  }, 600);
                }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Enter Details</h3>
                  <p className="text-xs text-slate-500">Provide your name & number for kitchen orders</p>
                </div>

                <div className="relative space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="pl-11 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl h-12 text-xs font-medium focus:bg-white focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="relative space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <Input
                      type="tel"
                      placeholder="Enter 10 digit number"
                      value={tempPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) {
                          setTempPhone(val);
                        }
                      }}
                      className="pl-11 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl h-12 text-xs font-medium focus:bg-white focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={verifyingOtp}
                  className="w-full text-white font-extrabold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer border-none text-xs"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
                    boxShadow: `0 8px 20px -4px ${primaryCol}40`,
                  }}
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue to Menu
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (otpInput.length !== 6) {
                    Swal.fire({
                      icon: "error",
                      title: "Invalid Length",
                      text: "Please enter a 6-digit OTP code",
                      confirmButtonColor: primaryCol,
                    });
                    return;
                  }
                  setVerifyingOtp(true);
                  setTimeout(() => {
                    setVerifyingOtp(false);
                    if (otpInput === "123456") {
                      setCustomerDetails(tempName, tempPhone, true);
                      setCustomerName(tempName);
                      setCustomerPhone(tempPhone);
                      Swal.fire({
                        icon: "success",
                        title: "🎉 Verified!",
                        text: "Welcome to our menu!",
                        timer: 1800,
                        showConfirmButton: false,
                      });
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "Incorrect OTP",
                        html: "Invalid OTP code. Please enter <b>123456</b> for demo verification.",
                        confirmButtonColor: primaryCol,
                      });
                    }
                  }, 600);
                }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Verify Mobile Number</h3>
                  <p className="text-xs text-slate-500">Code sent to +91 {tempPhone}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Enter 123456"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) {
                          setOtpInput(val);
                        }
                      }}
                      className="pl-11 bg-slate-50 border-slate-200 text-slate-900 rounded-2xl h-12 text-sm tracking-[0.2em] font-extrabold text-center focus:bg-white focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3.5 text-center text-xs text-orange-800 font-medium">
                  💡 <strong>Demo Bypass:</strong> Enter <strong>123456</strong> to verify instantly.
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationStep("details");
                      setOtpInput("");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={verifyingOtp}
                  className="w-full text-white font-extrabold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer border-none text-xs"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
                    boxShadow: `0 8px 20px -4px ${primaryCol}40`,
                  }}
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Open Menu
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Waiter Request Calls with SweetAlert2
  const handleCallWaiter = () => {
    Swal.fire({
      title: "🛎️ Call Waiter?",
      text: `Would you like to notify staff to assist Table ${tableNumber}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Call Waiter",
      cancelButtonText: "Cancel",
      confirmButtonColor: primaryCol,
    }).then((result) => {
      if (result.isConfirmed) {
        if (socket && restaurant) {
          socket.emit("call-waiter", {
            branchId: (restaurant as any).branchId || "",
            tableNumber,
          });
          Swal.fire({
            icon: "success",
            title: "Waiter Notified!",
            text: "A staff member is on their way to your table.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Connecting...",
            text: "Connecting to server. Please try again in a moment.",
            confirmButtonColor: primaryCol,
          });
        }
      }
    });
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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Added ${item.name} to order`,
        showConfirmButton: false,
        timer: 1500,
      });
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

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Added ${customizingItem.name}`,
      showConfirmButton: false,
      timer: 1500,
    });
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
        Swal.fire({
          icon: "success",
          title: "🎉 Coupon Applied!",
          text: `Saved ₹${res.discountAmount} on your order!`,
          timer: 2000,
          showConfirmButton: false,
        });
        setCouponCodeText("");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: err.message || "Invalid coupon code",
        confirmButtonColor: primaryCol,
      });
    } finally {
      setCouponValidationLoading(false);
    }
  };

  // Order placing handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "Please select dishes from the menu before placing an order.",
        confirmButtonColor: primaryCol,
      });
      return;
    }
    if (!customerName || !customerPhone) {
      Swal.fire({
        icon: "warning",
        title: "Customer Details Required",
        text: "Please enter your name and phone number.",
        confirmButtonColor: primaryCol,
      });
      return;
    }
    if (customerPhone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits.",
        confirmButtonColor: primaryCol,
      });
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
        if (socket) {
          socket.emit("new-order", {
            branchId: res.branchId,
            orderId: res.orderId,
            tableNumber,
          });
        }

        clearCart();
        setCartOpen(false);

        await Swal.fire({
          icon: "success",
          title: "🎉 Order Placed!",
          text: "Your order has been sent directly to the kitchen!",
          timer: 1800,
          showConfirmButton: false,
        });

        router.push(`/${restaurantSlug}/table/${tableNumber}/track/${res.orderId}`);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Order Placement Failed",
        text: err.message || "Failed to place order. Please try again.",
        confirmButtonColor: primaryCol,
      });
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col pb-28 relative overflow-x-hidden font-sans">
      {/* Soft background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-transparent pointer-events-none blur-3xl" />

      {/* Clean Light Header */}
      <header className="sticky top-0 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 px-5 py-4 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-orange-500/15"
            style={{ backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)` }}
          >
            {restaurant.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none mb-1">{restaurant.name}</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                Table {tableNumber}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCallWaiter}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 text-orange-700 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
        >
          <BellRing className="h-4 w-4 text-orange-600 animate-pulse" />
          Call Waiter
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 mt-6 space-y-6 flex-1 z-10">
        {/* Hero Card */}
        <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 relative overflow-hidden shadow-sm shadow-slate-200/50">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-orange-600">Digital QR Dining</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">Welcome to {restaurant.name}</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg">Browse our fresh menu items, customize your portions, and send orders straight to the kitchen.</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
              <Clock className="h-4 w-4 text-slate-600" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Prep Time:</span>
              <span className="text-xs font-extrabold text-slate-800">~ 15-20 Mins</span>
            </div>
          </div>
        </div>

        {/* Dietary Preference Selector */}
        <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-4">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Dietary Filter</h3>
          <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 p-1.5 rounded-2xl w-full">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer text-center ${
                filterType === "all"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("veg")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center ${
                filterType === "veg"
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Veg Only
            </button>
            <button
              onClick={() => setFilterType("non-veg")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center ${
                filterType === "non-veg"
                  ? "bg-red-500 text-white shadow-sm shadow-red-500/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-300" />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="relative">
          <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
            <button
              onClick={() => setSelectedCat("All")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                selectedCat === "All"
                  ? "text-white shadow-md shadow-orange-500/20 border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
              style={{
                backgroundColor: selectedCat === "All" ? primaryCol : undefined,
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
                  className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isSel
                      ? "text-white shadow-md shadow-orange-500/20 border-transparent"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                  style={{
                    backgroundColor: isSel ? primaryCol : undefined,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {filteredItems.length === 0 ? (
            <div className="md:col-span-2 text-center py-20 text-slate-400 text-xs bg-white border border-slate-200/80 rounded-3xl">
              <UtensilsCrossed className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              No matching menu items found in this section.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`p-4 bg-white border border-slate-200/80 hover:border-orange-500/30 rounded-[28px] flex gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 group relative ${
                  item.isOutOfStock ? "opacity-55 pointer-events-none" : ""
                }`}
              >
                {/* Image */}
                <div className="h-28 w-28 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/60 relative">
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <UtensilsCrossed className="h-8 w-8 text-slate-300" />
                  )}
                  {/* Food type badge */}
                  <span className={`absolute top-2.5 left-2.5 p-0.5 rounded-md bg-white/90 border ${item.foodType === "veg" ? "border-emerald-500" : "border-red-500"} flex items-center justify-center h-5 w-5 shadow-xs`}>
                    <span className={`h-2 w-2 rounded-full ${item.foodType === "veg" ? "bg-emerald-500" : "bg-red-500"}`} />
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                      {item.isRecommended && (
                        <span className="bg-orange-50 border border-orange-200 text-orange-700 text-[9px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-orange-500" /> Reco
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-slate-500 font-bold">₹</span>
                      <span className="text-base font-extrabold text-slate-900">{item.price}</span>
                    </div>
                    {item.isOutOfStock ? (
                      <span className="text-[10px] text-red-500 uppercase font-black tracking-wider bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">Sold Out</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddItemClick(item)}
                        className="text-white font-extrabold py-2 px-4.5 h-auto text-xs rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-none"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
                          boxShadow: `0 4px 14px -4px ${primaryCol}40`,
                        }}
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

      {/* Footer Section */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-12 mb-24 text-center space-y-3 border-t border-slate-200/80 pt-8">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <UtensilsCrossed className="h-4 w-4" />
          <span className="text-[11px] uppercase font-extrabold tracking-widest">{restaurant.name}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium italic max-w-xs mx-auto">
          "Good food is the foundation of genuine happiness. Prepared fresh, served with love!"
        </p>
      </footer>

      {/* Floating Bottom Cart Island */}
      {totalQty > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full text-white p-4 rounded-3xl font-extrabold flex items-center justify-between shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer border-none"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
              boxShadow: `0 10px 25px -5px ${primaryCol}50`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold block leading-none">{totalQty} {totalQty === 1 ? 'Dish' : 'Dishes'} Selected</span>
                <span className="text-[10px] text-white/80 font-medium mt-0.5 block">View bill summary</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold">₹{total.toFixed(0)}</span>
              <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Customise Item Modal Popup */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{customizingItem.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize portion sizes or add extras</p>
              </div>
              <button onClick={() => setCustomizingItem(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Variants Portion Selection */}
              {customizingItem.variants?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Select Portion</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {customizingItem.variants.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedVariant?.name === v.name
                            ? "bg-orange-50/80 border-orange-500 text-slate-900 font-bold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold">{v.name}</span>
                        <span className="text-sm font-extrabold text-slate-900 mt-1">₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons Selection */}
              {customizingItem.addons?.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Add Extra Addons</h4>
                  <div className="space-y-2">
                    {customizingItem.addons.map((a) => {
                      const isSel = selectedAddons.some((addon) => addon._id === a._id);
                      return (
                        <button
                          key={a._id}
                          type="button"
                          onClick={() => handleAddonToggle(a)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSel
                              ? "bg-orange-50/80 border-orange-500 text-slate-900 font-bold shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-bold">{a.name}</span>
                          <span className="text-xs font-extrabold text-slate-900">+ ₹{a.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Special Requests</label>
                <textarea
                  placeholder="Make it extra spicy / No onions / Less salt..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3.5 text-xs focus:outline-none focus:border-orange-500 h-20 resize-none transition-colors"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <Button
                onClick={handleConfirmCustomization}
                className="w-full text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg border-none text-xs"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
                  boxShadow: `0 8px 20px -4px ${primaryCol}40`,
                }}
              >
                Add Customized Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Panel Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">Your Bill Check</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex-1 text-xs space-y-1">
                      <p className="font-extrabold text-slate-900">{item.name}</p>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-slate-500 font-semibold">Portion: {item.selectedVariant.name}</p>
                      )}
                      {item.selectedAddons?.length > 0 && (
                        <p className="text-[11px] text-orange-600 font-semibold">
                          + {item.selectedAddons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-slate-500 italic">Req: &quot;{item.specialInstructions}&quot;</p>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center rounded-xl text-slate-600 cursor-pointer transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-slate-900 font-extrabold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center rounded-xl text-slate-600 cursor-pointer transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="block text-[11px] text-red-500 hover:underline mt-1 cursor-pointer font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-orange-500" /> Apply Coupon Code
                </h4>
                {coupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-emerald-800 tracking-wider">Applied: {coupon.code}</p>
                      <p className="text-emerald-600 font-semibold text-[11px]">
                        Saved: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </p>
                    </div>
                    <button onClick={() => setCoupon(null)} className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-xs">
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
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 transition-colors uppercase"
                    />
                    <Button
                      onClick={handleValidateCoupon}
                      disabled={couponValidationLoading}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 rounded-2xl cursor-pointer font-bold border-none"
                    >
                      {couponValidationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Customer input details form */}
              <form onSubmit={handlePlaceOrder} id="cartPlaceOrderForm" className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Your Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Your Name *"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    disabled={isVerified}
                    className="bg-slate-50 border-slate-200 text-slate-900 rounded-2xl text-xs font-medium"
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
                    disabled={isVerified}
                    className="bg-slate-50 border-slate-200 text-slate-900 rounded-2xl text-xs font-medium"
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
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Food Items Subtotal:</span>
                  <span className="font-extrabold text-slate-900">₹{subtotal}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>Discount Code Applied:</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                {cgst > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>CGST ({cgstRate}%):</span>
                    <span className="font-extrabold text-slate-900">₹{cgst.toFixed(1)}</span>
                  </div>
                )}
                {sgst > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>SGST ({sgstRate}%):</span>
                    <span className="font-extrabold text-slate-900">₹{sgst.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount due:</span>
                  <span className="text-base text-orange-600">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="cartPlaceOrderForm"
                disabled={submittingOrder || items.length === 0}
                className="w-full text-white font-extrabold h-13 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform cursor-pointer border-none text-xs"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryCol}, #f97316)`,
                  boxShadow: `0 8px 20px -4px ${primaryCol}40`,
                }}
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

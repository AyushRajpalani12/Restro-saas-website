"use client";

import React, { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Flame,
  Award,
  Loader2,
  Info,
  Clock,
} from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface Restaurant {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
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
}

interface MenuResponse {
  success: boolean;
  restaurant: Restaurant;
  theme: Theme;
  categories: Category[];
  menuItems: MenuItem[];
}

export default function RestaurantSlugPage({ params }: { params: Promise<{ restaurantSlug: string }> }) {
  const { restaurantSlug } = use(params);
  const [selectedCat, setSelectedCat] = useState<string>("All");

  // Query menu
  const { data: response, isLoading, error } = useQuery<MenuResponse>({
    queryKey: ["customer", "menu", restaurantSlug],
    queryFn: () => apiFetch(`/api/customer/menu?slug=${restaurantSlug}`),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !response?.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <UtensilsCrossed className="h-16 w-16 text-slate-800 mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-white mb-2">Restaurant Offline</h1>
        <p className="text-slate-400 max-w-sm mb-6">
          The restaurant you are looking for does not exist or has paused operations.
        </p>
      </div>
    );
  }

  const { restaurant, categories, menuItems, theme } = response;

  const filteredItems = menuItems.filter((item) => {
    if (selectedCat === "All") return true;
    return item.categoryId === selectedCat;
  });

  const primaryCol = theme.primaryColor || "#ea580c";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-10">
      {/* Hero Header */}
      <div className="relative bg-slate-900/40 border-b border-slate-900/60 p-6 md:p-10 text-center space-y-3 relative overflow-hidden shrink-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[140px]" style={{ backgroundColor: `${primaryCol}10` }} />

        <div className="z-10 relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white font-black text-2xl shadow-xl shadow-orange-500/10 mb-3" style={{ background: `linear-gradient(to top right, ${primaryCol}, #f59e0b)` }}>
            {restaurant.name.charAt(0)}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-semibold mt-2.5">
            {restaurant.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-500" /> {restaurant.phone}
              </span>
            )}
            {restaurant.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {restaurant.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dine-in Scan notification banner */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3.5 items-start">
          <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white">Viewing Restaurant Menu</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              To place a dine-in order and have food delivered directly to your table, please scan the QR code sign present on your dining table.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-8 space-y-4 flex-1">
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

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className={`p-4 bg-slate-900/10 border border-slate-850 rounded-2xl flex gap-4 ${
                item.isOutOfStock ? "opacity-60" : ""
              }`}
            >
              {/* Dish Photo */}
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

              {/* Dish Meta */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-extrabold text-white leading-tight">{item.name}</h3>
                    {item.isRecommended && (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Award className="h-2 w-2" /> Recommended
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
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Ready in 15m
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

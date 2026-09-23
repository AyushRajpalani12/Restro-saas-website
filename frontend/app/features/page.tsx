import React from "react";
import Navbar from "@/components/home/Navbar";
import Features from "@/components/home/Features";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Features - QR Code Ordering, KDS & Waiter Alerts",
  description:
    "Explore Restro SaaS features: Contactless QR Table Ordering, Real-Time Kitchen Display System (KDS Screen), Waiter Assistance Alerts, and Multi-Branch Management.",
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Navbar />
      <main className="pt-20">
        <Features />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

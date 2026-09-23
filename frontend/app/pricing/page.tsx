import React from "react";
import Navbar from "@/components/home/Navbar";
import Pricing from "@/components/home/Pricing";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Pricing Plans - Flexible Subscriptions for Restaurants",
  description:
    "Transparent pricing for Restro SaaS. Starter, Professional, and Enterprise plans with 0% POS commissions and instant 14-day trial.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Navbar />
      <main className="pt-20">
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

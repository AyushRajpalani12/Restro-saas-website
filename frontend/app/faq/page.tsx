import React from "react";
import Navbar from "@/components/home/Navbar";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) - Restro SaaS",
  description:
    "Find answers to common questions about setting up QR code table ordering, kitchen display screens, waiter notifications, and zero commission pricing.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Navbar />
      <main className="pt-20">
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

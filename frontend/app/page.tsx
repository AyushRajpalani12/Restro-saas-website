import React from "react";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import Features from "@/components/home/Features";
import InteractiveDemo from "@/components/home/InteractiveDemo";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Landing Page Sections */}
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <InteractiveDemo />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

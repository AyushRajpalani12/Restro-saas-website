"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleBackToDashboard = () => {
    const role = (session?.user as any)?.role;
    if (role === "SUPER_ADMIN") {
      router.push("/super-admin/dashboard");
    } else if (role === "RESTAURANT_ADMIN") {
      router.push("/admin/dashboard");
    } else if (role === "BRANCH_MANAGER") {
      router.push("/branch/dashboard");
    } else if (role === "KITCHEN") {
      router.push("/kitchen");
    } else if (role === "STAFF" || role === "CASHIER") {
      router.push("/staff");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="z-10 max-w-md space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-500 shadow-lg shadow-red-500/5 animate-pulse">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Access Denied
        </h1>

        <p className="text-slate-400 text-base max-w-sm mx-auto">
          You do not have the required permissions to view this resource. Please make sure you are signed in with the correct account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
          <Button
            onClick={handleBackToDashboard}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 py-2.5 px-6 font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

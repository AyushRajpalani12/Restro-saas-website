"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/super-admin/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
      Redirecting to Super Admin Dashboard...
    </div>
  );
}

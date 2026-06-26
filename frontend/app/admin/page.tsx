"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
      Redirecting to Admin Dashboard...
    </div>
  );
}

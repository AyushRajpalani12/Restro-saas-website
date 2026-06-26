"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0f172a", // slate-900
          color: "#f8fafc", // slate-50
          border: "1px solid #1e293b", // slate-800
        },
        success: {
          iconTheme: {
            primary: "#10b981", // green-500
            secondary: "#0f172a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "#0f172a",
          },
        },
      }}
    />
  );
};

export default ToastProvider;

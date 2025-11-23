"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          color: "#1f2937",
        },
      }}
    />
  );
}

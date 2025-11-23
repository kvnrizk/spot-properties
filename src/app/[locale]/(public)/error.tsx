"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Error boundary caught:", error);

    // Log error to system (async, non-blocking)
    fetch("/api/system/log-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        source: "public-error-boundary",
        location: window.location.pathname,
      }),
    }).catch((err) => {
      console.error("Failed to log error to system:", err);
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-spot-beige flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 mb-2">{t("subtitle")}</p>
          <p className="text-gray-500 mb-6">{t("description")}</p>
          {error.digest && (
            <p className="text-sm text-gray-400 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block bg-spot-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Spot Properties - Real Estate in Lebanon & Cyprus",
  description: "Find your perfect property in Lebanon and Cyprus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={poppins.variable}>
      <body suppressHydrationWarning className={poppins.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

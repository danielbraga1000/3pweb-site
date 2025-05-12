"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransitionLayout from "@/components/layout/PageTransitionLayout";
import { ReactLenis } from "@studio-freight/react-lenis"; // Import ReactLenis

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "3PWeb - Sculpting Digital Futures",
  description: "Pioneering AI & Web3 Marketing Solutions from Dubai to the Globe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-brandBackground text-brandText font-sans antialiased">
        <ReactLenis root options={{ lerp: 0.07, duration: 1.2, smoothTouch: true }}> {/* Wrap with ReactLenis */}
          <Navbar />
          <main>
            <PageTransitionLayout>{children}</PageTransitionLayout>
          </main>
          <Footer />
        </ReactLenis>
      </body>
    </html>
  );
}


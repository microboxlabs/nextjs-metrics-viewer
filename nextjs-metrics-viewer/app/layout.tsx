// /app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { WebSocketProvider } from '@/context/WebSocketContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Metrics Dashboard",
  description: "A powerful dashboard for managing and visualizing metrics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AuthProvider>
          <WebSocketProvider> 
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

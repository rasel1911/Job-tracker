"use client";

import "../globals.css";
import React from "react";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  let activeTab = "overview";
  if (pathname?.includes("jobs")) activeTab = "jobs";
  else if (pathname?.includes("notifications")) activeTab = "notifications";
  else if (pathname?.includes("overview")) activeTab = "overview";
  else if (pathname?.includes("job-dashboard")) activeTab = "job-dashboard";
  else if (pathname?.includes("job-bords")) activeTab = "job-bords";
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} />
        <main className="flex-1 bg-gray-900">
          {/* Neon background effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}

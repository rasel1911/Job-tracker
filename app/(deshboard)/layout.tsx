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

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </>
  );
}

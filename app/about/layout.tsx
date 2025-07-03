"use client";

import "../globals.css";
import React from "react";
import Header from "../../components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </>
  );
}

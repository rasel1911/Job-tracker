"use client";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">JobTracker</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <Link href="/login">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import JobsTab from "@/components/jobTabs";

// Filter SVG Icon
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4.5h18M6.75 9.75h10.5M9.75 15h4.5"
    />
  </svg>
);

export default function JobsPage() {
  // State to manage selected job type
  const [selectedType, setSelectedType] = useState<"Private" | "Government">(
    "Private",
  );

  return (
    <div className="space-y-6 min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            Jobs
          </h1>
          <p className="text-gray-400">Manage your job applications</p>
        </div>
        <div className="flex gap-2">
          <Button
            className={`bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 ${selectedType === "Private" ? "" : "bg-opacity-70"}`}
            onClick={() => setSelectedType("Private")}
          >
            <FilterIcon /> Private Jobs
          </Button>
          <Button
            className={`bg-gradient-to-r from-pink-500 to-cyan-500 text-white border-0 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 ${selectedType === "Government" ? "" : "bg-opacity-70"}`}
            onClick={() => setSelectedType("Government")}
          >
            <FilterIcon /> Government Jobs
          </Button>
        </div>
      </div>
      <JobsTab type={selectedType} />
    </div>
  );
}

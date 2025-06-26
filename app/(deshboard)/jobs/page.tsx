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
  const [selectedType, setSelectedType] = useState<"Private" | "Government">(
    "Private",
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-gray-600">Manage your job applications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === "Private" ? "default" : "outline"}
            onClick={() => setSelectedType("Private")}
          >
            <FilterIcon /> Private Jobs
          </Button>
          <Button
            variant={selectedType === "Government" ? "default" : "outline"}
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

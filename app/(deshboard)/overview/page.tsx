"use client";
import React, { useState } from "react";
import { StatsCards } from "@/components/statsCards";

import RecentJob from "@/components/resentJob";

export default function OverviewTab() {
  const [jobType, setJobType] = useState<"Private" | "Government">("Private");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-600">
          Here&apos;s your job application overview
        </p>
      </div>
      {/* Toggle */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border overflow-hidden">
          {(["Private", "Government"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setJobType(t)}
              className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                jobType === t
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {t} Job
            </button>
          ))}
        </div>
      </div>
      <StatsCards jobType={jobType} />
      {/* Recent Applications */}
      <RecentJob type={jobType} />
    </div>
  );
}

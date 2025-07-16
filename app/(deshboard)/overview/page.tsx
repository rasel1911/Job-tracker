"use client";
import React, { useState } from "react";
import { StatsCards } from "@/components/statsCards";

import RecentJob from "@/components/resentJob";

export default function OverviewTab() {
  const [jobType, setJobType] = useState<"Private" | "Government">("Private");
  return (
    <div className="space-y-6 p-4 bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome back, John!
        </h1>
        <p className="text-purple-300">
          Here&apos;s your job application overview
        </p>
      </div>
      {/* Toggle */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border-2 border-cyan-500/50 bg-gray-800/60 overflow-hidden">
          {(["Private", "Government"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setJobType(t)}
              className={`px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-300 ${
                jobType === t
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                  : "bg-gray-900 text-cyan-400 hover:bg-gray-800 hover:text-purple-400"
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

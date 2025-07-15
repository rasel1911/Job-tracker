"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddJobForm from "@/components/addNewJob";
import { Jobs } from "@/components/jobs";
import AIJobAnalysis from "@/components/aiAddJobs";
import AIGovtJobAnalysis from "@/components/AIGovtJobAnalysis";

export default function JobsTab({ type }: { type: "Private" | "Government" }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  return (
    <div className="space-y-6 min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            {type} Jobs
          </h1>
          <p className="text-gray-400">
            Manage your {type} sector applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            onClick={() => setShowAIForm(true)}
          >
            AI Analysis
          </Button>
          <Button
            className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300"
            onClick={() => setShowAddForm(true)}
          >
            Add New Job
          </Button>
        </div>
      </div>

      {showAddForm && (
        <AddJobForm type={type} onClose={() => setShowAddForm(false)} />
      )}
      {showAIForm && type === "Private" && (
        <AIJobAnalysis type={type} onClose={() => setShowAIForm(false)} />
      )}
      {showAIForm && type === "Government" && (
        <AIGovtJobAnalysis type={type} onClose={() => setShowAIForm(false)} />
      )}

      {/* Jobs List */}
      <div className="grid gap-4">
        <Jobs type={type} />
      </div>
    </div>
  );
}

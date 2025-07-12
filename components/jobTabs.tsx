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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{type} Jobs</h1>
          <p className="text-gray-600">
            Manage your {type} sector applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowAIForm(true)}>
            AI Analysis
          </Button>
          <Button onClick={() => setShowAddForm(true)}>Add New Job</Button>
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

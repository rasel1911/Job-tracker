"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  type: "Private" | "Government";
}

export function StatsCards({ jobType }: { jobType: "Private" | "Government" }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await fetch("/api/show-jobs");
        const result = await res.json();
        let allJobs: Job[] = [];
        if (result.data) {
          if (Array.isArray(result.data)) {
            // If API returns a flat array (shouldn't, but fallback)
            allJobs = result.data;
          } else {
            // API returns { privateJobs, governmentJobs }
            allJobs = [
              ...(result.data.privateJobs || []).map((j: any) => ({
                ...j,
                type: "Private",
              })),
              ...(result.data.governmentJobs || []).map((j: any) => ({
                ...j,
                type: "Government",
              })),
            ];
          }
        }
        setJobs(allJobs);
      } catch (e) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => j.type === jobType);
  const total = filtered.length;
  const inProgress = filtered.filter((j) => j.status === "in progress").length;
  const interviews = filtered.filter((j) => j.status === "interview").length;
  const offers = filtered.filter((j) => j.status === "offer").length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gray-800/50 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-cyan-400">{total}</div>
          <p className="text-xs text-cyan-400">&nbsp;</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10 hover:border-purple-400 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-400">{inProgress}</div>
          <p className="text-xs text-purple-300">Active applications</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-2 border-pink-500/30 shadow-lg shadow-pink-500/10 hover:border-pink-400 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-pink-400">{interviews}</div>
          <p className="text-xs text-pink-300">Scheduled</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-cyan-400">{offers}</div>
          <p className="text-xs text-cyan-300">Received</p>
        </CardContent>
      </Card>
    </div>
  );
}

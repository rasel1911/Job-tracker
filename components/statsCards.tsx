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
  const inProgress = filtered.filter((j) => j.status === "Applied").length;
  const interviews = filtered.filter((j) => j.status === "Interview").length;
  const offers = filtered.filter((j) => j.status === "Offer").length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-green-600">&nbsp;</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgress}</div>
          <p className="text-xs text-blue-600">Active applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviews}</div>
          <p className="text-xs text-orange-600">Scheduled</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offers}</div>
          <p className="text-xs text-green-600">Received</p>
        </CardContent>
      </Card>
    </div>
  );
}

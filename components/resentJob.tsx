"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "./ui/loading";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  applyStart: string;
  applyEnd: string;
  hasCircular: string;
  hasAdmitCard: string;
}

export default function RecentJob({
  type,
}: {
  type: "Private" | "Government";
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/show-jobs?jobType=${type.toLowerCase()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        const formattedJobs = data.data.map((job: any) => ({
          id: job.id,
          title: job.jobTitle || "No Title",
          company: job.companyName || "Unknown Company",
          location: job.location || "Location not specified",
          status: job.status || "Applied",
          applyStart:
            job.applyStartDate || new Date().toISOString().split("T")[0],
          applyEnd:
            job.applyEndDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          hasCircular: job.circularFile,
          hasAdmitCard: job.admitCardFile,
        }));

        setJobs(formattedJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [type]);

  return (
    <Card className="bg-gray-800/50 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Recent Applications
        </CardTitle>
        <CardDescription className="text-purple-300">
          Your latest job applications
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loading />
        </div>
      ) : (
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-900/60 shadow shadow-cyan-500/10"
              >
                <div>
                  <h3 className="font-semibold text-cyan-400 drop-shadow-[0_0_6px_cyan]">
                    {job.title}
                  </h3>
                  <p className="text-sm text-purple-300">
                    {job.company} • {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow shadow-cyan-500/10 ${
                      job.status === "Applied"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white border border-cyan-400"
                        : job.status === "Interview"
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border border-pink-400"
                          : "bg-gradient-to-r from-green-400 to-cyan-400 text-white border border-green-300"
                    }`}
                  >
                    {job.status}
                  </span>
                  <p className="text-xs text-pink-300 mt-1">{job.applyEnd}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      {error && (
        <CardContent className="text-pink-400 text-sm">{error}</CardContent>
      )}
    </Card>
  );
}

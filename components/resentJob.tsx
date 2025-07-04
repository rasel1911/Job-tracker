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
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your latest job applications</CardDescription>
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
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      job.status === "Applied"
                        ? "bg-blue-100 text-blue-800"
                        : job.status === "Interview"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {job.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{job.applyEnd}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      {error && (
        <CardContent className="text-red-500 text-sm">{error}</CardContent>
      )}
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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

export function Jobs({ type }: { type: "Private" | "Government" }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCircular, setSelectedCircular] = useState<string | null>(null);

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
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [type]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No jobs found. Add a new job to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderJobCard = (job: Job) => (
    <Card key={job.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-1">{job.company}</p>
            <p className="text-gray-500 text-sm mb-3">{job.location}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>
                Apply: {job.applyStart} to {job.applyEnd}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {job.hasCircular && (
                <button
                  onClick={() => setSelectedCircular(job.hasCircular)}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                >
                  📄 Circular
                </button>
              )}
              {job.hasAdmitCard && (
                <button
                  onClick={() => setSelectedCircular(job.hasAdmitCard)}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                >
                  📄 Admit Card
                </button>
              )}
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                job.status === "Applied"
                  ? "bg-blue-100 text-blue-800"
                  : job.status === "Interview"
                    ? "bg-orange-100 text-orange-800"
                    : job.status === "Offer"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {job.status}
            </span>
            <div className="mt-3 space-x-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <>
      {jobs.map(renderJobCard)}

      <Dialog
        open={!!selectedCircular}
        onOpenChange={(open: boolean) => !open && setSelectedCircular(null)}
      >
        <DialogContent className="w-[100vw] h-[100vh] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Circular</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            {selectedCircular && (
              <iframe
                src={selectedCircular}
                className="w-full h-full border rounded-md"
                title="Circular Document"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

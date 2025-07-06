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
import NotesBox from "./note-box";

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

interface UserFile {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
}

export function Jobs({ type }: { type: "Private" | "Government" }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCircular, setSelectedCircular] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [selectedResumeJob, setSelectedResumeJob] = useState<Job | null>(null);
  const [cvFiles, setCvFiles] = useState<UserFile[]>([]);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  // Edit dialog state
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  useEffect(() => {
    if (selectedResumeJob) {
      setCvLoading(true);
      setCvError(null);
      fetch("/api/cv-find")
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch CV files");
          const data = await res.json();
          setCvFiles(data.data || []);
        })
        .catch(() => setCvError("Failed to load CV files"))
        .finally(() => setCvLoading(false));
    } else {
      setCvFiles([]);
      setCvError(null);
    }
  }, [selectedResumeJob]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-4">
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
              <button
                onClick={() => setNotes("Notes")}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
              >
                📄 Notes
              </button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(job)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(job)}
              >
                Delete
              </Button>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedResumeJob(job)}
              >
                <span className="text-xs">Resume Maker</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Edit and Delete handlers
  const handleDelete = async (job: Job) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/show-jobs?jobType=${type.toLowerCase()}&jobId=${job.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success("Job deleted successfully");
    } catch (err) {
      setError("Failed to delete job. Please try again later.");
      toast.error("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditJob(job);
    setEditForm({ ...job });
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async () => {
    if (!editJob) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await fetch(
        `/api/show-jobs?jobType=${type.toLowerCase()}&jobId=${editJob.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: editForm.title,
            companyName: editForm.company,
            location: editForm.location,
            applyStartDate: editForm.applyStart,
            applyEndDate: editForm.applyEnd,
            // Add more fields as needed
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to update job");
      const data = await response.json();
      setJobs((prev) =>
        prev.map((j) => (j.id === editJob.id ? { ...j, ...editForm } : j)),
      );
      setEditJob(null);
      toast.success("Job updated successfully");
    } catch (err) {
      setEditError("Failed to update job. Please try again later.");
      toast.error("Failed to update job");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      {jobs.map(renderJobCard)}
      {/* Edit Dialog */}
      <Dialog
        open={!!editJob}
        onOpenChange={(open) => !open && setEditJob(null)}
      >
        <DialogContent className="max-w-lg w-full p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {editJob && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  name="title"
                  value={editForm.title || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Company</label>
                <input
                  name="company"
                  value={editForm.company || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  name="location"
                  value={editForm.location || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">
                    Apply Start
                  </label>
                  <input
                    name="applyStart"
                    type="date"
                    value={editForm.applyStart || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Apply End</label>
                  <input
                    name="applyEnd"
                    type="date"
                    value={editForm.applyEnd || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              {editError && <div className="text-red-500">{editError}</div>}
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={editLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editLoading ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditJob(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
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
      <Dialog
        open={!!notes}
        onOpenChange={(open: boolean) => !open && setNotes(null)}
      >
        <DialogContent className="w-[100vw] h-[100vh] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <NotesBox />
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selectedResumeJob}
        onOpenChange={(open: boolean) => !open && setSelectedResumeJob(null)}
      >
        <DialogContent className="max-w-lg w-full p-6 rounded-xl shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              Resume Maker
            </DialogTitle>
          </DialogHeader>
          {selectedResumeJob && (
            <ResumeMakerDialog
              job={selectedResumeJob}
              cvFiles={cvFiles}
              cvLoading={cvLoading}
              cvError={cvError}
              onClose={() => setSelectedResumeJob(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ResumeMakerDialog component
function ResumeMakerDialog({
  job,
  cvFiles,
  cvLoading,
  cvError,
  onClose,
}: {
  job: Job;
  cvFiles: UserFile[];
  cvLoading: boolean;
  cvError: string | null;
  onClose: () => void;
}) {
  const [selectedCV, setSelectedCV] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedCV || !message) {
      setError("Please select a CV and enter a message.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const selectedFile = cvFiles.find((f) => f.id === selectedCV);
      const files = selectedFile
        ? [
            {
              name: selectedFile.name,
              type: selectedFile.type === "pdf" ? "pdf" : "image",
              content: selectedFile.imageUrl,
            },
          ]
        : [];
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files,
          message: `Job URL: ${job.hasCircular}\n${message}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to generate cover letter.");
      }
    } catch (e) {
      setError("Failed to generate cover letter.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="font-semibold">Job:</span>{" "}
        <span className="text-gray-700">{job.title}</span>
      </div>
      <div>
        <label className="block font-semibold mb-1">Select your CV:</label>
        {cvLoading ? (
          <div>Loading CV files...</div>
        ) : cvError ? (
          <div className="text-red-500">{cvError}</div>
        ) : cvFiles.length === 0 ? (
          <div>No CV files found.</div>
        ) : (
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={selectedCV}
            onChange={(e) => setSelectedCV(e.target.value)}
          >
            <option value="">Select a CV file</option>
            {cvFiles.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">Message:</label>
        <textarea
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message or cover letter instructions..."
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSubmit}
          disabled={submitting || cvLoading || !cvFiles.length}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded border max-h-60 overflow-auto">
          <div className="font-semibold mb-2">AI Response:</div>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

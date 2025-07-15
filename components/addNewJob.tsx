"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/action/uploadUtils";

export default function AddJobForm({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useFileUpload();

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};

    // Handle file upload if a file is selected
    let circularFileUrl = data.get("circularFile") as string;

    if (file) {
      try {
        setIsUploading(true);
        circularFileUrl = await uploadFile(file, (progress: number) => {
          console.log("Upload progress:", progress);
        });
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
        setIsUploading(false);
        return;
      }
    }

    // Prepare payload
    data.forEach((value, key) => {
      if (key !== "circularFile") {
        payload[key] = value;
      }
    });

    // Add the file URL to payload if available
    if (circularFileUrl) {
      payload.circularFile = circularFileUrl;
    }

    try {
      const res = await fetch("/api/add-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType: type.toLowerCase(), payload }),
      });

      if (res.ok) {
        onClose();
      } else {
        console.error("Failed to save job", await res.json());
      }
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (type === "Private") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add New Private Job
          </CardTitle>
          <CardDescription className="text-gray-400">
            Fill in the details for your job application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g. Senior Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="companyName"
                  name="companyName"
                  placeholder="e.g. Google Inc."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                id="location"
                name="location"
                placeholder="e.g. San Francisco, CA"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applyStartDate">Application Start Date *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="applyStartDate"
                  name="applyStartDate"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applyEndDate">Application End Date *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="applyEndDate"
                  name="applyEndDate"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="examDate"
                  name="examDate"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circularFile">Circular File</Label>
                <div className="flex flex-col space-y-2">
                  <Input
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    id="circularFile"
                    name="circularFile"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                  />
                  {file && (
                    <span className="text-sm text-gray-500">
                      Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <textarea
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                id="note"
                name="note"
                placeholder="Any additional notes about this job..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </Button>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add New Government Job</CardTitle>
          <CardDescription>Fill in the government job details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="jobTitle"
                  name="jobTitle"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Department *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="companyName"
                  name="companyName"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                id="location"
                name="location"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applyStartDate">Apply Start *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="applyStartDate"
                  name="applyStartDate"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applyEndDate">Apply End *</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="applyEndDate"
                  name="applyEndDate"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="examDate"
                  name="examDate"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circularFile">Circular File (URL)</Label>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  id="circularFile"
                  name="circularFile"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admitCardFile">Admit Card (URL)</Label>
              <Input
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                id="admitCardFile"
                name="admitCardFile"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <textarea
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                id="note"
                name="note"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </Button>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}

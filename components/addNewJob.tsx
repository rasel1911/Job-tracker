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
          <CardTitle>Add New Private Job</CardTitle>
          <CardDescription>
            Fill in the details for your job application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g. Senior Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
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
                  id="applyStartDate"
                  name="applyStartDate"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applyEndDate">Application End Date *</Label>
                <Input
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
                <Input id="examDate" name="examDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circularFile">Circular File</Label>
                <div className="flex flex-col space-y-2">
                  <Input
                    id="circularFile"
                    name="circularFile"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    className="block w-full text-sm text-gray-500"
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
                id="note"
                name="note"
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Any additional notes about this job..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
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
                <Input id="jobTitle" name="jobTitle" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Department *</Label>
                <Input id="companyName" name="companyName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applyStartDate">Apply Start *</Label>
                <Input
                  id="applyStartDate"
                  name="applyStartDate"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applyEndDate">Apply End *</Label>
                <Input
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
                <Input id="examDate" name="examDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circularFile">Circular File (URL)</Label>
                <Input id="circularFile" name="circularFile" type="url" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admitCardFile">Admit Card (URL)</Label>
              <Input id="admitCardFile" name="admitCardFile" type="url" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <textarea
                id="note"
                name="note"
                className="w-full p-2 border rounded-md min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}

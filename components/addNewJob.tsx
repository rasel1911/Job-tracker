"use client";
import React from "react";
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

export default function AddJobForm({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};
    data.forEach((value, key) => {
      payload[key] = value;
    });

    const res = await fetch("/api/add-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobType: type.toLowerCase(), payload }),
    });

    if (res.ok) {
      onClose();
    } else {
      // eslint-disable-next-line no-console
      console.error("Failed to save job", await res.json());
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
                <Label htmlFor="circularFile">Circular File (URL)</Label>
                <Input
                  id="circularFile"
                  name="circularFile"
                  type="url"
                  placeholder="https://example.com/circular.pdf"
                />
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
              <Button type="submit">Save</Button>
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
              <Button type="submit">Save</Button>
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

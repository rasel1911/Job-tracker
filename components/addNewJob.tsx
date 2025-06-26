"use client";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New {type} Job</CardTitle>
        <CardDescription>
          Fill in the details for your job application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" placeholder="e.g. Senior Developer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company/Agency</Label>
              <Input id="company" placeholder="e.g. Google Inc." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. San Francisco, CA" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applyStart">Application Start Date</Label>
              <Input id="applyStart" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applyEnd">Application End Date</Label>
              <Input id="applyEnd" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="circular">Job Circular</Label>
              <Input id="circular" type="file" accept=".pdf,.doc,.docx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admitCard">Admit Card</Label>
              <Input id="admitCard" type="file" accept=".pdf,.doc,.docx" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="w-full p-2 border rounded-md">
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">Save Job</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

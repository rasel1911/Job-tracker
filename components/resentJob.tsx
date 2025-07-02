import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const jobList = [
  {
    title: "Senior Developer",
    company: "Tech Corp",
    status: "Applied",
    date: "2 days ago",
    type: "Private",
  },
  {
    title: "Data Analyst",
    company: "Ministry of IT",
    status: "Interview",
    date: "1 week ago",
    type: "Government",
  },
  {
    title: "Product Manager",
    company: "StartupXYZ",
    status: "Offer",
    date: "3 days ago",
    type: "Private",
  },
];

export default function RecentJob({
  jobType,
}: {
  jobType: "Private" | "Government";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your latest job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobList
            .filter((j) => j.type === jobType)
            .map((job, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.type}
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
                  <p className="text-xs text-gray-500 mt-1">{job.date}</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

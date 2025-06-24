"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const jobs = [
  {
    title: "Senior Software Engineer",
    company: "Google Inc.",
    location: "San Francisco, CA",
    status: "Applied",
    applyStart: "2024-01-15",
    applyEnd: "2024-02-15",
    hasCircular: true,
    hasAdmitCard: false,
  },
  {
    title: "Product Manager",
    company: "Microsoft",
    location: "Seattle, WA",
    status: "Interview",
    applyStart: "2024-01-10",
    applyEnd: "2024-02-10",
    hasCircular: true,
    hasAdmitCard: true,
  },
];

export function Jobs() {
  return jobs.map((job, index) => (
    <Card key={index}>
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
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  📄 Circular
                </span>
              )}
              {job.hasAdmitCard && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  🎫 Admit Card
                </span>
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
  ));
}

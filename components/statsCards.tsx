"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { jobList } from "./resentJob";

export function StatsCards({ jobType }: { jobType: "Private" | "Government" }) {
  const filtered = jobList.filter((j) => j.type === jobType);
  const total = filtered.length;
  const inProgress = filtered.filter((j) => j.status === "Applied").length;
  const interviews = filtered.filter((j) => j.status === "Interview").length;
  const offers = filtered.filter((j) => j.status === "Offer").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-green-600">+2 this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgress}</div>
          <p className="text-xs text-blue-600">Active applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviews}</div>
          <p className="text-xs text-orange-600">Scheduled</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offers}</div>
          <p className="text-xs text-green-600">Received</p>
        </CardContent>
      </Card>
    </div>
  );
}

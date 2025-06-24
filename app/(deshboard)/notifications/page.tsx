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

export default function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">
          Manage your notification preferences and view recent alerts
        </p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive notifications via email
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive browser push notifications
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Deadline Reminders</h3>
              <p className="text-sm text-gray-600">
                Get reminded before application deadlines
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Application Deadline Reminder",
                message:
                  "Your application for Senior Developer at Tech Corp expires in 2 days",
                time: "2 hours ago",
                type: "warning",
              },
              {
                title: "Interview Scheduled",
                message:
                  "Interview scheduled for Data Analyst position at Ministry of IT",
                time: "1 day ago",
                type: "info",
              },
              {
                title: "Application Status Updated",
                message:
                  "Your application for Product Manager at StartupXYZ has been updated to 'Offer'",
                time: "3 days ago",
                type: "success",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === "warning"
                      ? "bg-orange-500"
                      : notification.type === "info"
                        ? "bg-blue-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

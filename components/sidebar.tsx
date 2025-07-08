import Link from "next/link";
import { Briefcase, CheckCircle, Bell } from "lucide-react";

export default function Sidebar({ activeTab }: { activeTab: string }) {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4 space-y-2">
        <Link
          href="/overview"
          className={`w-full flex items-center px-4 py-2 rounded-md text-left ${activeTab === "overview" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Overview
        </Link>
        <Link
          href="jobs"
          className={`w-full flex items-center px-4 py-2 rounded-md text-left ${activeTab === "jobs" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Jobs Add
        </Link>
        <Link
          href="/notifications"
          className={`w-full flex items-center px-4 py-2 rounded-md text-left ${activeTab === "notifications" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Link>
        <Link
          href="/job-dashboard"
          className={`w-full flex items-center px-4 py-2 rounded-md text-left ${activeTab === "job-dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          All Jobs
        </Link>
      </nav>
    </aside>
  );
}

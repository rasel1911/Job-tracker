import Link from "next/link";
import {
  Briefcase,
  LayoutDashboard,
  Bell,
  FileText,
  Search,
} from "lucide-react";

export default function Sidebar({ activeTab }: { activeTab: string }) {
  const menuItems = [
    {
      name: "Dashboard",
      href: "/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: activeTab === "overview",
    },
    {
      name: "Jobs Add",
      href: "jobs",
      icon: <FileText className="h-5 w-5" />,
      active: activeTab === "jobs",
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      active: activeTab === "notifications",
    },
    {
      name: "All Jobs",
      href: "/job-dashboard",
      icon: <Search className="h-5 w-5" />,
      active: activeTab === "job-dashboard",
    },
    {
      name: "Job Boards",
      href: "/job-bords",
      icon: <Briefcase className="h-5 w-5" />,
      active: activeTab === "job-bords",
    },
  ];

  return (
    <aside className="w-64 bg-gray-800 backdrop-blur-sm border-r border-gray-800 min-h-screen relative overflow-hidden">
      {/* Neon background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Job Tracker
        </h2>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
              item.active
                ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-white border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/10"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white border-l-4 border-transparent"
            }`}
          >
            <span
              className={`mr-3 ${item.active ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"} transition-colors`}
            >
              {item.icon}
            </span>
            <span
              className={`font-medium ${item.active ? "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" : ""}`}
            >
              {item.name}
            </span>
            {item.active && (
              <span className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

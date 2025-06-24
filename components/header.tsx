import { Briefcase } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">JobTracker</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Add your header actions here if needed */}
        </div>
      </div>
    </header>
  );
}

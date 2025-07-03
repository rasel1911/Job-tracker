import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <a href="/" className="text-2xl font-bold text-gray-900">
            JobTracker
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/overview" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          {session.user?.name || session.user?.email?.split("@")[0]}
        </span>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button asChild>
      <Link href="/login">Sign In</Link>
    </Button>
  );
}

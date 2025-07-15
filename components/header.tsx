import { Briefcase, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="bg-gray-800 backdrop-blur-sm border-b border-gray-800">
      {/* Neon background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
            <Briefcase className="h-6 w-6 text-cyan-400" />
          </div>
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Job Tracker
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            href="/overview"
            icon={<LayoutDashboard className="h-5 w-5" />}
          >
            Dashboard
          </NavLink>
          <NavLink href="/about" icon={<Briefcase className="h-5 w-5" />}>
            About
          </NavLink>
          <div className="ml-4">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-all duration-300 group"
    >
      <span className="mr-2 text-cyan-500 group-hover:text-cyan-400 transition-colors">
        {icon}
      </span>
      <span className="font-medium group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
        {children}
      </span>
    </Link>
  );
}

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-gray-300">
          {session.user?.name || session.user?.email?.split("@")[0]}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300"
    >
      Sign In
    </Link>
  );
}

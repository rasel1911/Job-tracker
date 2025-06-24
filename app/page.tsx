"use client"
import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, CheckCircle, FileText, Shield, Bell } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return <Dashboard />
  }

  return <LandingPage onAuthenticate={() => setIsAuthenticated(true)} />
}

function LandingPage({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">JobTracker</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <Button variant="outline">Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track Your Job Applications
            <span className="text-blue-600"> Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize and manage your job applications across private and government sectors. Never miss a deadline with
            smart notifications and comprehensive tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Organization</h3>
              <p className="text-gray-600">
                Categorize jobs into Private and Government sectors with detailed tracking.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">Get email and push notifications for deadlines and status updates.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-gray-600">Upload and organize job circulars, admit cards, and other documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-md">
          <AuthTabs onAuthenticate={onAuthenticate} />
        </div>
      </section>
    </div>
  )
}

function AuthTabs({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Welcome to JobTracker</CardTitle>
        <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm onAuthenticate={onAuthenticate} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onAuthenticate={onAuthenticate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function SignInForm({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onAuthenticate()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" required />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
      <div className="text-center">
        <Button variant="link" className="text-sm">
          Forgot password?
        </Button>
      </div>
    </form>
  )
}

function SignUpForm({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onAuthenticate()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Create a password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm your password" required />
      </div>
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">JobTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              Profile
            </Button>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "private" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("private")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Private Jobs
            </Button>
            <Button
              variant={activeTab === "government" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("government")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Government Jobs
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "private" && <JobsTab type="Private" />}
          {activeTab === "government" && <JobsTab type="Government" />}
          {activeTab === "notifications" && <NotificationsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-600">Here`&apos;`s your job application overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-600">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-blue-600">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-orange-600">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-green-600">Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your latest job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
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
              { title: "Product Manager", company: "StartupXYZ", status: "Offer", date: "3 days ago", type: "Private" },
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
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
    </div>
  )
}

function JobsTab({ type }: { type: "Private" | "Government" }) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{type} Jobs</h1>
          <p className="text-gray-600">Manage your {type.toLowerCase()} sector applications</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>Add New Job</Button>
      </div>

      {showAddForm && <AddJobForm type={type} onClose={() => setShowAddForm(false)} />}

      {/* Jobs List */}
      <div className="grid gap-4">
        {[
          {
            title: "Senior Software Engineer",
            company: type === "Private" ? "Google Inc." : "Department of Technology",
            location: "San Francisco, CA",
            status: "Applied",
            applyStart: "2024-01-15",
            applyEnd: "2024-02-15",
            hasCircular: true,
            hasAdmitCard: false,
          },
          {
            title: "Product Manager",
            company: type === "Private" ? "Microsoft" : "Ministry of Digital Affairs",
            location: "Seattle, WA",
            status: "Interview",
            applyStart: "2024-01-10",
            applyEnd: "2024-02-10",
            hasCircular: true,
            hasAdmitCard: true,
          },
        ].map((job, index) => (
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">📄 Circular</span>
                    )}
                    {job.hasAdmitCard && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">🎫 Admit Card</span>
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
        ))}
      </div>
    </div>
  )
}

function AddJobForm({ type, onClose }: { type: string; onClose: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New {type} Job</CardTitle>
        <CardDescription>Fill in the details for your job application</CardDescription>
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
  )
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">Manage your notification preferences and view recent alerts</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Deadline Reminders</h3>
              <p className="text-sm text-gray-600">Get reminded before application deadlines</p>
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
                message: "Your application for Senior Developer at Tech Corp expires in 2 days",
                time: "2 hours ago",
                type: "warning",
              },
              {
                title: "Interview Scheduled",
                message: "Interview scheduled for Data Analyst position at Ministry of IT",
                time: "1 day ago",
                type: "info",
              },
              {
                title: "Application Status Updated",
                message: "Your application for Product Manager at StartupXYZ has been updated to 'Offer'",
                time: "3 days ago",
                type: "success",
              },
            ].map((notification, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
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
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFileUpload } from "@/action/uploadUtils";
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Building2,
  Send,
  FileText,
} from "lucide-react";

// Mock job data
// NOTE: mockJobs retained for fallback but will be replaced by data from API
const mockJobs = [
  {
    id: 1,
    organization: "TechCorp Solutions",
    logo: "/placeholder.svg?height=60&width=60",
    category: "Software Development",
    location: "San Francisco, CA",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    description:
      "We are looking for a talented Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.",
    requirements:
      "• 3+ years of experience in React and Node.js\n• Strong knowledge of TypeScript\n• Experience with cloud platforms (AWS/Azure)\n• Excellent problem-solving skills",
    fileUrl: "https://example.com/job-description.pdf",
  },
  {
    id: 2,
    organization: "Design Studio Pro",
    logo: "/placeholder.svg?height=60&width=60",
    category: "Design",
    location: "New York, NY",
    startDate: "2024-01-20",
    endDate: "2024-03-01",
    description:
      "Join our creative team as a Senior UI/UX Designer. You'll work on cutting-edge projects for Fortune 500 companies and innovative startups.",
    requirements:
      "• 5+ years of UI/UX design experience\n• Proficiency in Figma, Sketch, and Adobe Creative Suite\n• Strong portfolio showcasing web and mobile designs\n• Understanding of design systems",
    fileUrl: "https://example.com/design-brief.pdf",
  },
  {
    id: 3,
    organization: "DataFlow Analytics",
    logo: "/placeholder.svg?height=60&width=60",
    category: "Data Science",
    location: "Austin, TX",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    description:
      "We're seeking a Data Scientist to help us unlock insights from complex datasets and drive data-driven decision making across the organization.",
    requirements:
      "• PhD or Master's in Data Science, Statistics, or related field\n• Experience with Python, R, and SQL\n• Knowledge of machine learning algorithms\n• Strong analytical and communication skills",
    fileUrl: "https://example.com/data-role.pdf",
  },
  {
    id: 4,
    organization: "CloudTech Innovations",
    logo: "/placeholder.svg?height=60&width=60",
    category: "DevOps",
    location: "Seattle, WA",
    startDate: "2024-01-10",
    endDate: "2024-02-28",
    description:
      "Looking for a DevOps Engineer to streamline our deployment processes and maintain our cloud infrastructure at scale.",
    requirements:
      "• 4+ years of DevOps experience\n• Expertise in Docker, Kubernetes, and CI/CD\n• Experience with AWS or GCP\n• Knowledge of Infrastructure as Code (Terraform)",
    fileUrl: "https://example.com/devops-spec.pdf",
  },
];

const categories = [
  "All Categories",
  "Software Development",
  "Design",
  "Data Science",
  "DevOps",
  "Marketing",
  "Sales",
];
const locations = [
  "All Locations",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Remote",
];

export default function Component() {
  const [jobs, setJobs] = useState<any[]>([]); // will be populated from API
  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/public-add-jobs");
        if (res.ok) {
          const { data } = await res.json();
          const mapped = (data as any[]).map((job) => ({
            id: job.id,
            organization: job.org_name,
            logo: "/image.png?height=60&width=60", // Placeholder until logo support
            category: "Public",
            location: "N/A",
            startDate: job.created_at ?? new Date().toISOString(),
            endDate:
              job.apply_last_date ?? job.created_at ?? new Date().toISOString(),
            description: job.comment ?? "",
            requirements: "",
            fileUrl: job.file_link,
          }));
          setJobs(mapped);
        } else {
          console.error("Failed to fetch jobs", await res.text());
          // fall back to mock jobs if API fails
          setJobs(mockJobs);
        }
      } catch (error) {
        console.error(error);
        setJobs(mockJobs);
      }
    };

    fetchJobs();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedJob, setSelectedJob] = useState(null);
  const [newComment, setNewComment] = useState("");
  type Comment = {
    id: number;
    text: string;
    author: string;
    timestamp: string;
  };
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newJob, setNewJob] = useState({
    org_name: "",
    org_name_bn: "",
    file_link: "",
    apply_last_date: "",
    comment: "",
    apply_link: "",
  });
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useFileUpload();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      job.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "All Locations" || job.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddComment = (jobId: number) => {
    if (newComment.trim()) {
      setComments((prev) => ({
        ...prev,
        [jobId]: [
          ...(prev[jobId] || []),
          {
            id: Date.now(),
            text: newComment,
            author: "Current User",
            timestamp: new Date().toLocaleString(),
          },
        ],
      }));
      setNewComment("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setIsUploading(true);
    try {
      const url = await uploadFile(selected, (progress) => {
        // You can add a progress indicator if desired
        console.log("Upload progress", progress);
      });
      setNewJob((prev) => ({ ...prev, file_link: url }));
    } catch (error) {
      console.error(error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitAddJob = async () => {
    if (!newJob.org_name || !newJob.file_link) return;
    setIsSubmittingJob(true);
    try {
      const res = await fetch("/api/public-add-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        const { data } = await res.json();
        setJobs((prev) => [
          ...prev,
          {
            id: data?.[0]?.id || Date.now(),
            organization: newJob.org_name,
            logo: "/image.png?height=60&width=60",
            category: "Public",
            location: "N/A",
            startDate: new Date().toISOString(),
            endDate: newJob.apply_last_date || "",
            description: newJob.comment || "",
            requirements: "",
            fileUrl: newJob.file_link,
          },
        ]);
        setNewJob({
          org_name: "",
          org_name_bn: "",
          file_link: "",
          apply_last_date: "",
          comment: "",
          apply_link: "",
        });
      } else {
        console.error("Failed to add job", await res.text());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Neon background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Job Board
            </h1>
            <p className="text-gray-400">Discover your next opportunity</p>
          </div>

          {/* Add Job Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a Public Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  placeholder="Organization Name*"
                  value={newJob.org_name}
                  onChange={(e) =>
                    setNewJob({ ...newJob, org_name: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <Input
                  placeholder="Organization Name (BN)"
                  value={newJob.org_name_bn}
                  onChange={(e) =>
                    setNewJob({ ...newJob, org_name_bn: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <div className="flex flex-col space-y-2">
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                  {file && (
                    <span className="text-sm text-gray-400">
                      Selected: {file.name}
                    </span>
                  )}
                </div>
                <Input
                  type="date"
                  placeholder="Apply Last Date"
                  value={newJob.apply_last_date}
                  onChange={(e) =>
                    setNewJob({ ...newJob, apply_last_date: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <Input
                  placeholder="Apply Link"
                  value={newJob.apply_link}
                  onChange={(e) =>
                    setNewJob({ ...newJob, apply_link: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <Textarea
                  placeholder="Comment"
                  value={newJob.comment}
                  onChange={(e) =>
                    setNewJob({ ...newJob, comment: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitAddJob}
                  disabled={isSubmittingJob || isUploading}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white disabled:opacity-50"
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-white hover:bg-gray-700"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {locations.map((location) => (
                <SelectItem
                  key={location}
                  value={location}
                  className="text-white hover:bg-gray-700"
                >
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Dialog key={job.id}>
              <DialogTrigger asChild>
                <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 border-2 border-gray-700 group-hover:border-cyan-500/50 transition-colors">
                        <AvatarImage
                          src={job.logo || "/placeholder.svg"}
                          alt={job.organization}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-semibold">
                          {job.organization.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                          {job.organization}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30 mt-1"
                        >
                          {job.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>
                          {formatDate(job.startDate)} -{" "}
                          {formatDate(job.endDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 text-white overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <Avatar className="w-10 h-10 border-2 border-cyan-500/50">
                      <AvatarImage
                        src={job.logo || "/placeholder.svg"}
                        alt={job.organization}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-semibold">
                        {job.organization.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {job.organization}
                      </div>
                      <div className="text-sm text-gray-400 font-normal">
                        {job.category}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* Job Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                        Job Description
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">
                        Requirements
                      </h3>
                      <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {job.requirements}
                      </pre>
                    </div>

                    {/* File Preview */}
                    <div>
                      <h3 className="text-lg font-semibold text-pink-400 mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Job Document
                      </h3>
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <iframe
                          src={job.fileUrl}
                          className="w-full h-64 rounded border border-gray-600"
                          title="Job Document"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">
                      Comments
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {comments[job.id]?.map((comment: Comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-purple-400">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            {comment.text}
                          </p>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 resize-none"
                        rows={3}
                      />
                      <Button
                        onClick={() => handleAddComment(job.id)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

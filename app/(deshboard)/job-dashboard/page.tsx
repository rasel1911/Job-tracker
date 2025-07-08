"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  ImageIcon,
  MessageCircle,
  Send,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock job data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2 days ago",
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using React, TypeScript, and modern web technologies.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management libraries (Redux, Zustand)",
      "Familiarity with testing frameworks (Jest, React Testing Library)",
      "Knowledge of CSS preprocessors and CSS-in-JS solutions",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
    ],
    category: "Technology",
    experience: "Senior",
    remote: true,
    logo: "/placeholder.svg?height=60&width=60",
    image: "/placeholder.svg?height=400&width=600",
    pdf: "/job-description.pdf",
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        comment: "Great opportunity! The company culture seems amazing.",
        time: "1 hour ago",
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        comment:
          "I applied last week. The interview process was smooth and professional.",
        time: "3 hours ago",
      },
    ],
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    posted: "1 week ago",
    description:
      "Join our creative team as a UX/UI Designer. You'll work on exciting projects for various clients, creating intuitive and beautiful user experiences.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Strong portfolio showcasing design process",
      "Understanding of user-centered design principles",
      "Experience with prototyping and user testing",
    ],
    benefits: [
      "Creative and collaborative work environment",
      "Health and wellness benefits",
      "Flexible working hours",
      "Design conference attendance",
      "Equipment and software allowance",
    ],
    category: "Design",
    experience: "Mid-level",
    remote: false,
    logo: "/placeholder.svg?height=60&width=60",
    image: "/placeholder.svg?height=400&width=600",
    pdf: "/design-job-description.pdf",
    comments: [
      {
        id: 1,
        user: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        comment:
          "The portfolio requirements are quite specific. Make sure to showcase your process!",
        time: "2 days ago",
      },
    ],
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Austin, TX",
    type: "Contract",
    salary: "$90,000 - $120,000",
    posted: "3 days ago",
    description:
      "We're seeking a Data Scientist to help us extract insights from large datasets and build predictive models to drive business decisions.",
    requirements: [
      "PhD or Master's in Data Science, Statistics, or related field",
      "Strong programming skills in Python and R",
      "Experience with machine learning frameworks",
      "Knowledge of SQL and database systems",
      "Excellent communication and visualization skills",
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible schedule",
      "Access to cutting-edge tools and technologies",
      "Opportunity to work on diverse projects",
      "Potential for full-time conversion",
    ],
    category: "Data Science",
    experience: "Senior",
    remote: true,
    logo: "/placeholder.svg?height=60&width=60",
    image: "/placeholder.svg?height=400&width=600",
    pdf: "/data-scientist-job.pdf",
    comments: [],
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Growth Marketing Co.",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    posted: "5 days ago",
    description:
      "Lead our marketing efforts and drive growth through innovative campaigns and strategies. Perfect for someone passionate about digital marketing.",
    requirements: [
      "3+ years of marketing experience",
      "Experience with digital marketing channels",
      "Strong analytical and project management skills",
      "Knowledge of marketing automation tools",
      "Bachelor's degree in Marketing or related field",
    ],
    benefits: [
      "Performance-based bonuses",
      "Health and dental insurance",
      "Professional development opportunities",
      "Flexible work environment",
      "Stock options",
    ],
    category: "Marketing",
    experience: "Mid-level",
    remote: false,
    logo: "/placeholder.svg?height=60&width=60",
    image: "/placeholder.svg?height=400&width=600",
    pdf: "/marketing-manager-job.pdf",
    comments: [
      {
        id: 1,
        user: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        comment:
          "I'm interested in this role. Does anyone know about the company culture?",
        time: "1 day ago",
      },
      {
        id: 2,
        user: "Tom Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        comment:
          "I worked there briefly. Great team and good work-life balance!",
        time: "6 hours ago",
      },
    ],
  },
];

export default function JobDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedJob, setSelectedJob] = useState<(typeof jobs)[0] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [jobComments, setJobComments] = useState<{
    [key: number]: (typeof jobs)[0]["comments"];
  }>({});

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || job.category === selectedCategory;
    const matchesExperience =
      selectedExperience === "all" || job.experience === selectedExperience;
    const matchesType = selectedType === "all" || job.type === selectedType;

    return matchesSearch && matchesCategory && matchesExperience && matchesType;
  });

  const handleAddComment = () => {
    if (!selectedJob || !newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: "Current User",
      avatar: "/placeholder.svg?height=32&width=32",
      comment: newComment,
      time: "Just now",
    };

    setJobComments((prev) => ({
      ...prev,
      [selectedJob.id]: [
        ...(prev[selectedJob.id] || selectedJob.comments),
        comment,
      ],
    }));

    setNewComment("");
  };

  const getJobComments = (jobId: number) => {
    return (
      jobComments[jobId] || jobs.find((j) => j.id === jobId)?.comments || []
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Job Dashboard</h1>
          <p className="text-gray-600 mt-1">Find your next opportunity</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedExperience}
                onValueChange={setSelectedExperience}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Entry-level">Entry Level</SelectItem>
                  <SelectItem value="Mid-level">Mid Level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Dialog key={job.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={job.logo || "/placeholder.svg"}
                          alt={`${job.company} logo`}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {job.title}
                          </CardTitle>
                          <p className="text-gray-600 font-medium">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <Badge variant={job.remote ? "default" : "secondary"}>
                        {job.remote ? "Remote" : "On-site"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.type} • {job.posted}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline">{job.category}</Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {getJobComments(job.id).length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Image
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{job.title}</h2>
                      <p className="text-gray-600 font-normal">{job.company}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)]">
                  <div className="space-y-6">
                    {/* Job Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{job.posted}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Tabs for different sections */}
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="description">
                          Description
                        </TabsTrigger>
                        <TabsTrigger value="requirements">
                          Requirements
                        </TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Job Description
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Benefits</h3>
                          <ul className="space-y-1">
                            {job.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="text-gray-700 flex items-start"
                              >
                                <span className="text-green-500 mr-2">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="requirements" className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Requirements</h3>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li
                                key={index}
                                className="text-gray-700 flex items-start"
                              >
                                <span className="text-blue-500 mr-2">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="media" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Company Image
                            </h3>
                            <Image
                              src={job.image || "/placeholder.svg"}
                              alt="Company workspace"
                              width={300}
                              height={200}
                              className="rounded-lg border"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Job Description PDF
                            </h3>
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-red-500" />
                                <div>
                                  <p className="font-medium">
                                    Job Description.pdf
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Click to download
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full mt-3 bg-transparent"
                              >
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="space-y-4">
                        {/* Add Comment */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Add a Comment</h3>
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>CU</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder="Share your thoughts about this job..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="w-full sm:w-auto"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Comments List */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">
                            Comments ({getJobComments(job.id).length})
                          </h3>

                          {getJobComments(job.id).length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                              No comments yet. Be the first to share your
                              thoughts!
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {getJobComments(job.id).map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={comment.avatar || "/placeholder.svg"}
                                    />
                                    <AvatarFallback>
                                      {comment.user
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">
                                          {comment.user}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {comment.time}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {comment.comment}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

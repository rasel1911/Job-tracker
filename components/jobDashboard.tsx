"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/ui/loading";
import {
  Building2,
  Calendar,
  Users,
  ExternalLink,
  FileText,
  MessageSquare,
  Search,
  Filter,
  Clock,
  Briefcase,
} from "lucide-react";
type JobVacancy = {
  jobId: number;
  jobTitle: string;
  jobTitleBn: string;
  jobVacancy: number;
  orgId: number;
  orgName: string;
  applyStartDate: string;
  applyLastDate: string;
  urlLink: string;
  fileLink: {
    link: string;
    type: string;
  };
  comment: {
    text: string;
    createdAt: string;
    createdBy: string;
  };
};
export default function JobDashboard() {
  const [jobsData, setJobsData] = useState<JobVacancy[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch("/api/job-vacency");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobsData(data as JobVacancy[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);
  console.log("Jobs Data:", jobsData);

  // Group jobs by organization
  const groupedJobs = jobsData.reduce(
    (acc, job) => {
      if (!acc[job.orgId]) {
        acc[job.orgId] = {
          orgName: job.orgName,
          jobs: [],
        };
      }
      acc[job.orgId].jobs.push(job);
      return acc;
    },
    {} as Record<number, { orgName: string; jobs: JobVacancy[] }>,
  );

  // Filter jobs based on search term
  const filteredGroupedJobs = Object.entries(groupedJobs).reduce(
    (acc, [orgId, orgData]) => {
      const filteredJobs = orgData.jobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.orgName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      if (filteredJobs.length > 0) {
        acc[Number(orgId)] = {
          ...orgData,
          jobs: filteredJobs,
        };
      }
      return acc;
    },
    {} as Record<number, { orgName: string; jobs: JobVacancy[] }>,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOrgInitials = (orgName: string) => {
    return orgName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleApply = (url: string) => {
    window.open(url, "_blank");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, you would send this to your backend
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Job Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg border-0 transition-all duration-300"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Available Positions
            </h2>
            <p className="text-gray-400">
              Discover your next career opportunity
            </p>
          </div>

          {/* Job Listings Grouped by Organization */}
          <div className="space-y-8">
            {Object.entries(filteredGroupedJobs).map(([orgId, orgData]) => (
              <div key={orgId} className="space-y-4">
                {/* Organization Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/image.png?height=48&width=48`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getOrgInitials(orgData.orgName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {orgData.orgName}
                    </h3>
                    <p className="text-gray-500">
                      {orgData.jobs.length} open position
                      {orgData.jobs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orgData.jobs.map((job) => {
                    const daysRemaining = getDaysRemaining(job.applyLastDate);
                    return (
                      <Card
                        key={job.jobId}
                        className="bg-gray-800/50 border border-gray-700 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                        onClick={() => setSelectedJob(job)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold mb-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {job.jobTitle}
                              </CardTitle>
                              <CardDescription className="text-sm text-purple-300">
                                {job.jobTitleBn}
                              </CardDescription>
                            </div>
                            <Badge
                              className={`ml-2 px-3 py-1 rounded-full text-sm shadow-md transition-all duration-300
                                ${
                                  daysRemaining > 7
                                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                                    : daysRemaining > 0
                                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                }`}
                            >
                              {daysRemaining > 0
                                ? `${daysRemaining}d left`
                                : "Expired"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>
                                  {job.jobVacancy} position
                                  {job.jobVacancy !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Building2 className="h-4 w-4" />
                                <span className="truncate max-w-[120px]">
                                  {job.orgName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Deadline: {formatDate(job.applyLastDate)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                Posted: {formatDate(job.applyStartDate)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {orgId !==
                  Object.keys(filteredGroupedJobs)[
                    Object.keys(filteredGroupedJobs).length - 1
                  ] && <Separator className="my-8" />}
              </div>
            ))}
          </div>

          {Object.keys(filteredGroupedJobs).length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {selectedJob?.jobTitle}
            </DialogTitle>
            <DialogDescription className="text-lg text-purple-300">
              {selectedJob?.jobTitleBn}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="details"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Job Details</span>
              </TabsTrigger>
              <TabsTrigger
                value="document"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Document</span>
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Comments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Organization Info */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/image.png?height=64&width=64`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                        {selectedJob && getOrgInitials(selectedJob.orgName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedJob?.orgName}
                      </h3>
                      <p className="text-gray-400">Organization</p>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Job Title
                        </Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedJob?.jobTitle}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Job Title (Bengali)
                        </Label>
                        <p className="text-lg text-purple-300">
                          {selectedJob?.jobTitleBn}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Available Positions
                        </Label>
                        <p className="text-lg text-purple-300">
                          {selectedJob?.jobVacancy}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Application Start Date
                        </Label>
                        <p className="text-lg text-purple-300">
                          {selectedJob &&
                            formatDate(selectedJob.applyStartDate)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Application Deadline
                        </Label>
                        <p className="text-lg text-purple-300">
                          {selectedJob && formatDate(selectedJob.applyLastDate)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-cyan-400">
                          Days Remaining
                        </Label>
                        <Badge
                          className={`text-sm px-3 py-1 rounded-full shadow-md transition-all duration-300
                            ${
                              selectedJob &&
                              getDaysRemaining(selectedJob.applyLastDate) > 7
                                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                                : "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                            }`}
                        >
                          {selectedJob &&
                          getDaysRemaining(selectedJob.applyLastDate) > 0
                            ? `${getDaysRemaining(selectedJob.applyLastDate)} days left`
                            : "Expired"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  className="bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 hover:text-cyan-500 transition-all duration-300"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() =>
                    selectedJob && handleApply(selectedJob.urlLink)
                  }
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="document" className="space-y-4">
              <div className="h-[500px] border rounded-lg overflow-hidden bg-gray-800/50 border-gray-700">
                {selectedJob?.fileLink?.link ? (
                  <>
                    <iframe
                      src={`https://alljobs.teletalk.com.bd/media/${selectedJob.fileLink.link}`}
                      className="w-full h-full"
                      title="Job Document"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-cyan-400" />
                      <p>No document available {selectedJob?.fileLink?.link}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {selectedJob?.comment && (
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-cyan-400">
                          {selectedJob.comment.createdBy}
                        </span>
                        <span className="text-sm text-purple-300">
                          {new Date(
                            selectedJob.comment.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">
                        {selectedJob.comment.text}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="space-y-3 pt-4 border-t">
                <Label
                  htmlFor="comment"
                  className="text-sm font-medium text-cyan-400"
                >
                  Add a comment
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    className="bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 hover:text-cyan-500 transition-all duration-300"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Search, MessageCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type JobVacancy } from "@/db/schema/jobVacency.schema";

// Mock job data
export default function JobDashboard() {
  const [jobs, setJobs] = useState<JobVacancy[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [newComment, setNewComment] = useState("");
  const [jobComments, setJobComments] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/job-vacency");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Filter jobs based on search
  const filteredJobs = jobs
    ? jobs.filter((job) => {
        const matchesSearch =
          (job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobVacancy?.toLowerCase().includes(searchTerm.toLowerCase())) ??
          false;
        return matchesSearch;
      })
    : [];

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
        ...(prev[selectedJob.id] || selectedJob.comment || []),
        comment,
      ],
    }));
    setNewComment("");
  };

  const getJobComments = (jobId: string) => {
    return (
      jobComments[jobId] || jobs?.find((j) => j.id === jobId)?.comment || []
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading jobs...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

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
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs?.length || 0} jobs
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
                          src={"/image.png"}
                          alt={`${job.orgName} logo`}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {job.jobTitle}
                          </CardTitle>
                          <p className="text-gray-600 font-medium">
                            {job.orgName}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {job.applyLastDate ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold">Start:</span>&nbsp;
                        {job.applyStartDate
                          ? new Date(job.applyStartDate).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold">Deadline:</span>&nbsp;
                        {job.applyLastDate
                          ? new Date(job.applyLastDate).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline">ID: {job.jobId}</Badge>
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
                      src={"/image.png"}
                      alt={`${job.orgName} logo`}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{job.jobTitle}</h2>
                      <p className="text-gray-600 font-normal">{job.orgName}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)]">
                  <div className="space-y-6">
                    {/* Job Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Start:</span>
                        <span className="text-sm">
                          {job.applyStartDate
                            ? new Date(job.applyStartDate).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Deadline:</span>
                        <span className="text-sm">
                          {job.applyLastDate
                            ? new Date(job.applyLastDate).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Job ID:</span>
                        <span className="text-sm">{job.jobId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Org ID:</span>
                        <span className="text-sm">{job.orgId ?? "-"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {job.urlLink && (
                        <a
                          href={job.urlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="flex-1">Apply Now</Button>
                        </a>
                      )}
                    </div>

                    <Separator />

                    {/* Tabs for different sections */}
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">
                          Description
                        </TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Job Description
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {job.jobVacancy}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Job Title (BN)</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {job.jobTitleBn}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="space-y-4">
                        <div className="space-y-3"></div>
                        <Separator />
                        <div className="flex gap-2 items-center">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              setSelectedJob(job);
                              handleAddComment();
                            }}
                            disabled={!newComment.trim()}
                          >
                            Add
                          </Button>
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
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

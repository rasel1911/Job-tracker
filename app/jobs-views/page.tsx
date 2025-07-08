"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  X,
  Send,
  FileText,
  Image as ImageIcon,
  Building,
} from "lucide-react";

const JobDash = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});

  // Sample job data
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc",
      location: "New York, NY",
      type: "Full-time",
      category: "Technology",
      salary: "$80,000 - $120,000",
      posted: "2 days ago",
      deadline: "2025-07-25",
      description:
        "We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.",
      requirements: [
        "3+ years React experience",
        "Strong JavaScript/TypeScript skills",
        "Experience with modern CSS frameworks",
        "Knowledge of REST APIs",
      ],
      benefits: [
        "Health insurance",
        "401k matching",
        "Flexible work hours",
        "Remote work options",
      ],
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      attachments: [
        { name: "Job Description.pdf", type: "pdf", url: "#" },
        { name: "Company Overview.pdf", type: "pdf", url: "#" },
      ],
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "Brand Solutions",
      location: "Los Angeles, CA",
      type: "Full-time",
      category: "Marketing",
      salary: "$60,000 - $85,000",
      posted: "1 week ago",
      deadline: "2025-07-30",
      description:
        "Join our marketing team to lead campaigns and drive brand growth. You'll work on exciting projects across digital and traditional media channels.",
      requirements: [
        "5+ years marketing experience",
        "Digital marketing expertise",
        "Strong analytical skills",
        "Team leadership experience",
      ],
      benefits: [
        "Competitive salary",
        "Performance bonuses",
        "Professional development",
        "Creative work environment",
      ],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      attachments: [{ name: "Role Details.pdf", type: "pdf", url: "#" }],
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "San Francisco, CA",
      type: "Contract",
      category: "Design",
      salary: "$70,000 - $90,000",
      posted: "3 days ago",
      deadline: "2025-08-01",
      description:
        "Create intuitive and engaging user experiences for web and mobile applications. Work closely with product managers and developers.",
      requirements: [
        "Portfolio of UX work",
        "Proficiency in Figma/Sketch",
        "User research experience",
        "Prototyping skills",
      ],
      benefits: [
        "Flexible schedule",
        "Latest design tools",
        "Learning opportunities",
        "Collaborative team",
      ],
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      attachments: [
        { name: "Portfolio Guidelines.pdf", type: "pdf", url: "#" },
        { name: "Design Process.pdf", type: "pdf", url: "#" },
      ],
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Chicago, IL",
      type: "Part-time",
      category: "Technology",
      salary: "$45,000 - $65,000",
      posted: "5 days ago",
      deadline: "2025-07-28",
      description:
        "Analyze complex datasets to provide actionable insights for business decisions. Work with various stakeholders to understand data requirements.",
      requirements: [
        "SQL proficiency",
        "Python/R experience",
        "Data visualization skills",
        "Statistical analysis knowledge",
      ],
      benefits: [
        "Flexible hours",
        "Remote work",
        "Training budget",
        "Growth opportunities",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      attachments: [
        { name: "Technical Requirements.pdf", type: "pdf", url: "#" },
      ],
    },
    {
      id: 5,
      title: "Sales Representative",
      company: "SalesCorp",
      location: "Miami, FL",
      type: "Full-time",
      category: "Sales",
      salary: "$50,000 - $75,000",
      posted: "1 day ago",
      deadline: "2025-08-05",
      description:
        "Drive sales growth by building relationships with potential clients. Represent our products and services to key decision makers.",
      requirements: [
        "2+ years sales experience",
        "Strong communication skills",
        "CRM software knowledge",
        "Goal-oriented mindset",
      ],
      benefits: [
        "Commission structure",
        "Travel opportunities",
        "Sales training",
        "Career advancement",
      ],
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
      attachments: [
        { name: "Sales Territory Map.pdf", type: "pdf", url: "#" },
        { name: "Commission Structure.pdf", type: "pdf", url: "#" },
      ],
    },
  ];

  useEffect(() => {
    setJobs(sampleJobs);
    setFilteredJobs(sampleJobs);

    // Initialize comments for each job
    const initialComments = {};
    sampleJobs.forEach((job) => {
      initialComments[job.id] = [
        {
          id: 1,
          user: "John Doe",
          comment: "Great opportunity! When do applications close?",
          time: "2 hours ago",
        },
        {
          id: 2,
          user: "Sarah Smith",
          comment: "Is remote work available for this position?",
          time: "1 day ago",
        },
      ];
    });
    setComments(initialComments);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedCategory, selectedLocation, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((job) =>
        job.location.includes(selectedLocation),
      );
    }

    setFilteredJobs(filtered);
  };

  const categories = [...new Set(jobs.map((job) => job.category))];
  const locations = [
    ...new Set(
      jobs.map((job) => job.location.split(",")[1]?.trim() || job.location),
    ),
  ];

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleAddComment = (jobId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "Current User",
        comment: newComment,
        time: "Just now",
      };
      setComments((prev) => ({
        ...prev,
        [jobId]: [...(prev[jobId] || []), comment],
      }));
      setNewComment("");
    }
  };

  const JobCard = ({ job }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={() => handleJobClick(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-1 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            {job.company}
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {job.type}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </span>
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {job.posted}
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {job.category}
        </span>
        <span className="text-xs text-red-500">Deadline: {job.deadline}</span>
      </div>
    </div>
  );

  const JobModal = ({ job, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <img
                  src={job.image}
                  alt={job.company}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Company</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                  <p className="text-gray-600">{job.location}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Salary</h3>
                  <p className="text-gray-600">{job.salary}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Job Type</h3>
                  <p className="text-gray-600">{job.type}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Application Deadline
                  </h3>
                  <p className="text-red-500 font-medium">{job.deadline}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Job Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Requirements
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Benefits</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Attachments
                </h3>
                <div className="space-y-2">
                  {job.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {attachment.name}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm ml-auto">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>

            <div className="space-y-4 mb-4">
              {comments[job.id]?.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">
                      {comment.user}
                    </span>
                    <span className="text-sm text-gray-500">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.comment}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) =>
                  e.key === "Enter" && handleAddComment(job.id)
                }
              />
              <button
                onClick={() => handleAddComment(job.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Job Dashboard
              </h1>
              <p className="text-gray-600">Find your next opportunity</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredJobs.length} Jobs Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={handleCloseModal} />}
    </div>
  );
};

export default JobDash;

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/action/uploadUtils";

interface Analysis {
  companyName: string;
  jobTitle: string;
  email: string;
  applyDate: string;
  location?: string;
}

interface AnalysisResponse {
  success: boolean;
  analysis?: Analysis;
  error?: string;
}

export default function AIJobAnalysis({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  const { uploadFile } = useFileUpload();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis>({
    companyName: "",
    jobTitle: "",
    email: "",
    applyDate: "",
    location: "",
  });
  console.log(type);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const circularFileUrl = await uploadFile(file, (progress: number) => {
        console.log("Upload progress:", progress);
      });
      console.log("circularFileUrl:", circularFileUrl);
      setPreviewUrl(circularFileUrl);
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!analysis.companyName || !analysis.jobTitle) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/add-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobType: "private",
          payload: {
            companyName: analysis.companyName,
            jobTitle: analysis.jobTitle,
            email: analysis.email,
            applyStartDate: new Date().toISOString(),
            applyEndDate: new Date().toISOString(),
            location: analysis.location,
            // TODO: Add any other required fields according to your schema
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Job saved successfully!");
        onClose(); // Close the modal after successful save
      } else {
        throw new Error(data.message || "Failed to save job");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert(error instanceof Error ? error.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    setAnalysis({
      companyName: "",
      jobTitle: "",
      email: "",
      applyDate: "",
      location: "", // updated to include location property
    });

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data: AnalysisResponse = await response.json();
      console.log("data :", data);
      console.log("data.analysis :", data.analysis);
      console.log("data.success :", data.success);
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || "Failed to analyze image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setAnalysis({
      companyName: "",
      jobTitle: "",
      email: "",
      applyDate: "",
      location: "",
    });
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnalysis((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Job Analysis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Clear All
                </button>
              </div>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">Analyzing your image...</span>
                </div>
              </div>
            )}

            {/* Analysis Result */}
            {analysis.companyName && (
              <CardContent className="bg-gray-900 border border-gray-700 text-white">
                <form onSubmit={handleSaveJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={analysis.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Developer"
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={analysis.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Google Inc."
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={analysis.location || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applyStartDate">
                        Application Start Date *
                      </Label>
                      <Input
                        id="applyStartDate"
                        name="applyStartDate"
                        type="date"
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applyEndDate">
                        Application End Date *
                      </Label>
                      <Input
                        id="applyEndDate"
                        name="applyEndDate"
                        type="date"
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="examDate">Exam Date</Label>
                      <Input
                        id="examDate"
                        name="examDate"
                        type="date"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Notes</Label>
                    <textarea
                      id="note"
                      name="note"
                      className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Any additional notes about this job..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handleSaveJob}
                      disabled={
                        loading || !analysis.jobTitle || !analysis.companyName
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Saving..." : "Save Job"}
                    </Button>
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              How to use:
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Upload any image (JPG, PNG, GIF, etc.)</li>
              <li>• Enter your question or instruction about the image</li>
              <li>• Click "Analyze Image" to get AI-powered insights</li>
              <li>
                • Examples: "Describe this image", "What objects do you see?",
                "What's the mood of this photo?"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

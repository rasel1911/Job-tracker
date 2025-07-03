"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PersonalInfo from "@/components/about/personalInfo";
import Tabs from "@/components/about/ui/tabs";
import Input from "@/components/about/ui/input";
import FileUpload from "@/components/about/fileupload";
import FileDisplay from "@/components/about/filedisplay";
import Modal from "@/components/about/modal";
import type { UploadedFile } from "@/components/about/fileupload";
import { useFileUpload } from "@/action/uploadUtils";
import Loading from "@/components/ui/loading"; // Assuming you have a loading component
import { User, FileText } from "lucide-react";

// -----------------------------
// Utility Functions
// -----------------------------

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// -----------------------------
// Main Dashboard Component
// -----------------------------
export default function UserDashboard() {
  // State
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [fileModal, setFileModal] = useState<{
    open: boolean;
    file: File | null;
    type: UploadedFile["type"] | null;
    name: string;
  }>({ open: false, file: null, type: null, name: "" });

  const { uploadFile } = useFileUpload();

  const handleFileSelect = useCallback(
    (file: File, type: UploadedFile["type"]) => {
      setFileModal({
        open: true,
        file,
        type,
        name: file.name.replace(/\.[^/.]+$/, ""),
      });
    },
    [],
  );

  const handleFileUpload = async () => {
    if (!fileModal.file || !fileModal.type) return;
    try {
      setLoading(true);
      // Upload file to EdgeStore and get URL
      const url = await uploadFile(fileModal.file);
      // Map UI type to backend enum
      let backendType: "cv_file" | "photo" | "others_file" = "others_file";
      if (fileModal.type === "cv") backendType = "cv_file";
      else if (fileModal.type === "photo") backendType = "photo";
      // Save file metadata to backend
      const res = await fetch("/api/file-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fileModal.name.trim() || fileModal.file.name,
          type: backendType,
          imageUrl: url,
        }),
      });
      if (!res.ok) throw new Error("Failed to save file metadata");
      const { file: savedFile } = await res.json();
      const newFile: UploadedFile = {
        id: savedFile.id,
        name: savedFile.name,
        url: savedFile.imageUrl,
        type: fileModal.type,
        size: fileModal.file.size,
        uploadDate: new Date(savedFile.createdAt),
      };
      setFiles((prev) => [...prev, newFile]);
      setFileModal({ open: false, file: null, type: null, name: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "files", label: "Files", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile and documents
          </p>
        </motion.div>

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {activeTab === "overview" && <PersonalInfo />}

        {activeTab === "files" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <FileUpload onFileSelect={handleFileSelect} />
              <FileDisplay
                files={files}
                onRemove={(id) =>
                  setFiles((prev) => prev.filter((f) => f.id !== id))
                }
              />
            </motion.div>
          </>
        )}

        <Modal
          isOpen={fileModal.open}
          onClose={() =>
            setFileModal({ open: false, file: null, type: null, name: "" })
          }
          title={`Upload ${fileModal.type === "cv" ? "CV" : fileModal.type === "photo" ? "Photo" : "File"}`}
        >
          <div className="space-y-4">
            {loading && (loading ? <Loading /> : null)}
            <Input
              label="File Name"
              value={fileModal.name}
              onChange={(value) =>
                setFileModal((prev) => ({ ...prev, name: value }))
              }
              placeholder="Enter a name for the file"
              required
            />
            {fileModal.file && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Selected File:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {fileModal.file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(fileModal.file.size)}
                </p>
              </div>
            )}
            <select
              value={fileModal.type || ""}
              onChange={(e) =>
                setFileModal((prev) => ({
                  ...prev,
                  type: e.target.value as UploadedFile["type"],
                }))
              }
              required
            >
              <option value="">Select Type</option>
              <option value="cv">CV</option>
              <option value="photo">Photo</option>
              <option value="file">File</option>
            </select>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() =>
                  setFileModal({
                    open: false,
                    file: null,
                    type: null,
                    name: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!fileModal.name.trim()}
              >
                Upload
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

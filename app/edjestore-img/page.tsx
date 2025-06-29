"use client";

import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";

interface UploadedFile {
  url: string;
  size: number;
  uploadedAt: string;
  path: Record<string, any>; // or more specific type if you know the shape
  pathOrder: string[];
}

export default function Page() {
  const [file, setFile] = React.useState<File>();
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const { edgestore } = useEdgeStore();

  const handleUpload = async () => {
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log("Upload progress:", progress);
        },
      });
      // Add the new file to the list
      setUploadedFiles((prev) => [
        {
          url: res.url,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          path: res.path,
          pathOrder: res.pathOrder,
        },
        ...prev,
      ]);

      // Reset file input
      setFile(undefined);
      if (document.getElementById("file-upload") as HTMLInputElement) {
        (document.getElementById("file-upload") as HTMLInputElement).value = "";
      }
      console.log("Upload successful:", res);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  console.log("uploadedFiles", uploadedFiles);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">EdgeStore File Upload</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col space-y-4">
          <input
            id="file-upload"
            type="file"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              !file || isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="aspect-w-16 aspect-h-9 mb-3 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={file.url}
                      alt={`Uploaded file ${index + 1}`}
                      className="max-h-40 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/200x150?text=Preview+Not+Available";
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="truncate font-medium text-gray-900">
                      {file.path[file.path.length - 1] || "file"}
                    </p>
                    <p>{formatFileSize(file.size)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs block mt-2"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

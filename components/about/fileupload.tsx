import { Upload, User, FileText } from "lucide-react";
import React, { ChangeEvent } from "react";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: "cv" | "photo" | "other";
  size: number;
  uploadDate: Date;
}

// File Upload Component
interface FileUploadProps {
  onFileSelect: (file: File, type: UploadedFile["type"]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: UploadedFile["type"],
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file, type);
      e.target.value = ""; // Reset input
    }
  };

  const uploadOptions = [
    {
      label: "Upload CV",
      type: "cv" as const,
      accept: ".pdf,.doc,.docx",
      icon: FileText,
    },
    {
      label: "Upload Photo",
      type: "photo" as const,
      accept: "image/*",
      icon: User,
    },
    {
      label: "Upload Other",
      type: "other" as const,
      accept: "*",
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Upload Files
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {uploadOptions.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.type}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
            >
              <Icon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {option.label}
              </span>
              <input
                type="file"
                className="hidden"
                accept={option.accept}
                onChange={(e) => handleFileChange(e, option.type)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default FileUpload;
export type { UploadedFile };

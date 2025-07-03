import { X, FileText } from "lucide-react";
import type { UploadedFile } from "./fileupload";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// File Display Component
interface FileDisplayProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ files, onRemove }) => {
  const fileCategories = [
    {
      type: "cv" as const,
      title: "CV Files",
      files: files.filter((f) => f.type === "cv"),
    },
    {
      type: "photo" as const,
      title: "Photos",
      files: files.filter((f) => f.type === "photo"),
    },
    {
      type: "other" as const,
      title: "Other Files",
      files: files.filter((f) => f.type === "other"),
    },
  ];

  return (
    <div className="space-y-6">
      {fileCategories.map((category) => (
        <div key={category.type}>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            {category.title} ({category.files.length})
          </h4>
          {category.files.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No {category.title.toLowerCase()} uploaded.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.files.map((file) => (
                <div
                  key={file.id}
                  className="relative group border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {file.type === "photo" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {formatDate(file.uploadDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(file.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileDisplay;

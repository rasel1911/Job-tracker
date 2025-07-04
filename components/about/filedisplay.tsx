import { X } from "lucide-react";
import type { UploadedFile } from "./fileupload";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading"; // Assuming you have a loading component
import { useSession } from "next-auth/react";

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

const FileDisplay: React.FC<FileDisplayProps> = ({
  files: initialFiles,
  onRemove,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch files from the backend
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch("about/api/file-show");
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        console.log("Fetched files:", data);
        // Ensure uploadDate is a Date object
        const mapped = data.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
        }));
        setFiles(mapped);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

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

  const handleFileClick = (file: UploadedFile) => {
    setSelectedFile(file);
  };

  // Remove handler with API call
  const handleRemove = async (id: string) => {
    if (!userId) return; // Prevent API call if not logged in
    setRemovingId(id);
    try {
      const res = await fetch(`/about/api/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to delete file");
      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (onRemove) onRemove(id);
    } catch (err) {
      // Optionally show error toast
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal for file/photo preview */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      ) : (
        <>
          {selectedFile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6">
                <button
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mb-4">
                  <p className="text-lg font-semibold mb-2">
                    {selectedFile.name}
                  </p>
                  {selectedFile.type === "photo" ? (
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-120 object-contain rounded-md"
                    />
                  ) : (
                    <iframe
                      src={selectedFile.url}
                      title={selectedFile.name}
                      className="w-full h-120 rounded-md bg-gray-100 dark:bg-gray-700"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatFileSize(selectedFile.size)} •{" "}
                    {formatDate(selectedFile.uploadDate)}
                  </p>
                </div>
              </div>
            </div>
          )}
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
                      className="relative group border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      {file.type === "photo" ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                      ) : (
                        <iframe
                          src={file.url}
                          title={file.name}
                          className="w-full h-32 rounded-md mb-2 bg-gray-100 dark:bg-gray-700"
                        />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(file.id);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                        disabled={removingId === file.id}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
      ;
    </div>
  );
};

export default FileDisplay;

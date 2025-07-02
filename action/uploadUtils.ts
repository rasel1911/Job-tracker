import { useEdgeStore } from "@/lib/edgestore";

type UploadProgressCallback = (progress: number) => void;

export const useFileUpload = () => {
  const { edgestore } = useEdgeStore();

  const uploadFile = async (
    file: File,
    onProgressChange?: UploadProgressCallback,
  ): Promise<string> => {
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange,
      });
      return res.url;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("File upload failed. Please try again.");
    }
  };

  return { uploadFile };
};

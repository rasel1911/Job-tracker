import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AIGovtJobAnalysis({
  type,
  onClose,
}: {
  type: "Private" | "Government";
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      // You can add more fields if needed
      const res = await fetch("/api/ai-govtjob", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze image");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">AI Analysis for {type} Jobs</h2>
      <p className="text-gray-600">
        Upload a job circular image for AI analysis.
      </p>
      <input
        type="file"
        accept="image/*,.pdf,application/pdf"
        onChange={handleFileChange}
        className="my-2"
      />
      <Button
        onClick={handleAnalyze}
        disabled={loading || !file}
        className="mr-2"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </Button>
      <Button onClick={onClose} variant="outline">
        Close
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <h3 className="font-semibold">Analysis Result:</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(result.analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

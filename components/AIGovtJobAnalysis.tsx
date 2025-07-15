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
  const [message, setMessage] = useState("");

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
      formData.append("message", message);
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
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
        AI Analysis for {type} Jobs
      </h2>
      <p className="text-gray-400">
        Upload a job circular image for AI analysis.
      </p>
      <input
        type="file"
        accept="image/*,.pdf,application/pdf"
        onChange={handleFileChange}
        className="my-2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
      />
      <input
        type="text"
        placeholder="Enter a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="my-2 block w-full border rounded px-2 py-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
      />
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </Button>
      <Button
        onClick={onClose}
        variant="outline"
        className="mt-2 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-cyan-500 transition-all duration-300"
      >
        Close
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <h3 className="font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analysis Result:
          </h3>
          <h3 className="font-semibold">Analysis Result:</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(result.analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";

export default function GeminiChat() {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message && !imageUrl) {
      alert("Please provide either a message or an image URL");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/cloud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message);
      } else {
        setResponse(`Error: ${data.message}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  console.log("Data", response);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gemini AI Chat with Images
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message (optional if image provided):
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your message here..."
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
            Image URL (optional):
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview:</p>
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full h-auto max-h-64 object-contain border rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!message && !imageUrl)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Send to Gemini"}
        </button>
      </form>

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Gemini Response:</h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

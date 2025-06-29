"use client";

import { useState } from "react";

export default function Test() {
  const [pdfUrl, setPdfUrl] = useState<string>(
    "https://res.cloudinary.com/deo8nyu8j/raw/upload/v1751174770/doc_gmdnc0.pdf",
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">PDF Viewer</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <h2 className="text-lg font-medium text-gray-700">
              Document Preview
            </h2>
          </div>
          <div className="w-full h-[70vh]">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
              className="w-full h-full"
              frameBorder="0"
              title="PDF Viewer"
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-gray-700">PDF URL</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter PDF URL"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You can paste any direct PDF URL to view it here
          </p>
        </div>
      </div>
    </div>
  );
}

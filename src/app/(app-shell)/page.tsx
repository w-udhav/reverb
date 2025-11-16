"use client";

import Image from "next/image";
import { useState } from "react";

export default function AppShellHome() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch metadata");
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">App Shell</h1>
      <p className="text-zinc-600 mb-6">Welcome to the app shell.</p>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to fetch metadata..."
            className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Fetching..." : "Fetch Metadata"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {metadata && (
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Metadata</h2>
          {metadata.image && (
            <div className="mb-4">
              <Image
                src={metadata.image}
                alt={metadata.title || "Metadata image"}
                width={400}
                height={300}
                className="rounded-lg border border-zinc-200"
              />
            </div>
          )}
          <pre className="text-sm overflow-auto bg-white p-4 rounded border border-zinc-200">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}

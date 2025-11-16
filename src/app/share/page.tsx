"use client";

import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SharePageContent() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error from route handler
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    // Check if URL was shared via GET (query params) or if we need to handle POST
    const sharedUrl = searchParams.get("url") || searchParams.get("text");

    if (sharedUrl) {
      // Clean up the URL - sometimes text contains the URL
      const cleanUrl = sharedUrl.startsWith("http")
        ? sharedUrl
        : sharedUrl.match(/https?:\/\/[^\s]+/)?.[0] || sharedUrl;

      setUrl(cleanUrl);
      fetchMetadata(cleanUrl);
    }
  }, [searchParams]);

  const fetchMetadata = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setError("No URL provided");
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
        body: JSON.stringify({ url: targetUrl }),
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

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputUrl = formData.get("url") as string;
    if (inputUrl) {
      fetchMetadata(inputUrl);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Share Music</h1>
      <p className="text-zinc-600 mb-6">
        {url
          ? `Processing shared link...`
          : "Share your favorite tracks or paste a music link below."}
      </p>

      {!url && (
        <form onSubmit={handleManualSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="url"
              name="url"
              placeholder="Enter or paste a music URL..."
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
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          Fetching metadata...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {metadata && (
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            {metadata.title || "Music Track"}
          </h2>

          {metadata.image && (
            <div className="mb-4">
              <Image
                src={metadata.image}
                alt={metadata.title || "Track image"}
                width={400}
                height={300}
                className="rounded-lg border border-zinc-200 w-full object-cover"
              />
            </div>
          )}

          {metadata.description && (
            <p className="mb-4 text-zinc-700">{metadata.description}</p>
          )}

          {metadata.author && (
            <p className="mb-2 text-sm text-zinc-600">
              <span className="font-semibold">Artist:</span> {metadata.author}
            </p>
          )}

          {metadata.publisher && (
            <p className="mb-2 text-sm text-zinc-600">
              <span className="font-semibold">Platform:</span>{" "}
              {metadata.publisher}
            </p>
          )}

          {metadata.url && (
            <a
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Open original link →
            </a>
          )}

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-zinc-600 hover:text-zinc-800">
              View raw metadata
            </summary>
            <pre className="mt-2 text-xs overflow-auto bg-white p-4 rounded border border-zinc-200">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <main className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Share Music</h1>
          <p className="text-zinc-600">Loading...</p>
        </main>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}

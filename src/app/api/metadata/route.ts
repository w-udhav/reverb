// app/api/metadata/route.ts
export const dynamic = "force-dynamic";

async function getScraper() {
  const [
    metascraper,
    metascraperAuthor,
    metascraperDate,
    metascraperDescription,
    metascraperImage,
    metascraperLogo,
    metascraperPublisher,
    metascraperTitle,
    metascraperUrl,
  ] = await Promise.all([
    import("metascraper"),
    import("metascraper-author"),
    import("metascraper-date"),
    import("metascraper-description"),
    import("metascraper-image"),
    import("metascraper-logo"),
    import("metascraper-publisher"),
    import("metascraper-title"),
    import("metascraper-url"),
  ]);

  return metascraper.default([
    metascraperAuthor.default(),
    metascraperDate.default(),
    metascraperDescription.default(),
    metascraperImage.default(),
    metascraperLogo.default(),
    metascraperPublisher.default(),
    metascraperTitle.default(),
    metascraperUrl.default(),
  ]);
}

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
    });
  }

  try {
    // Fetch the HTML content of the target URL
    const response = await fetch(url);
    const html = await response.text();

    // Scrape the metadata using dynamic import
    const scraper = await getScraper();
    const metadata = await scraper({ html, url });

    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to scrape metadata" }),
      { status: 500 }
    );
  }
}

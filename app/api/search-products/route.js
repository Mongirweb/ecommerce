import { NextResponse } from "next/server";
import client from "../../lib/elasticSearch";
import sanitizeHtml from "sanitize-html";

export async function GET(req) {
  try {
    // Get the search query parameter from the URL
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("search");

    // 1) Sanitize the incoming query to remove any HTML/script tags
    const query = sanitizeHtml(rawQuery, {
      // Example: remove all HTML tags
      allowedTags: [],
      allowedAttributes: {},
    });

    // Validate the sanitized query
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid or missing search query. Please provide a valid search term.",
        },
        { status: 400 }
      );
    }

    // 2) Perform the Elasticsearch query
    const response = await client.search({
      index: "products", // Ensure this matches your index name
      body: {
        size: 6, // Limit the number of results to 6
        query: {
          match: {
            name: {
              query: query,
              fuzziness: "AUTO", // Allows for fuzzy matching (e.g., typos)
            },
          },
        },
      },
    });

    if (!response.hits?.hits || response.hits.hits.length === 0) {
      throw new Error("Elasticsearch query did not return any hits.");
    }

    // 3) Map results to a simplified structure
    const results = response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    return NextResponse.json(results);
  } catch (error) {
    // Log the error for debugging
    console.error("Error performing Elasticsearch search:", error);

    // Return a 500 error response
    return NextResponse.json(
      {
        message: "An error occurred while processing the search query.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

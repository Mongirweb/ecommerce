import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import SubCategory3 from "../../../models/SubCategory3";
import db from "../../../utils/db";

export async function GET(request) {
  // Extract the raw query param
  const rawTerm = request.nextUrl.searchParams.get("q") || "";

  // 1) Sanitize the query (removing HTML tags)
  const searchTerm = sanitizeHtml(rawTerm, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  // 2) If no search term or it's empty after sanitization, return empty array
  if (!searchTerm) {
    return NextResponse.json([]);
  }

  // 3) Connect to DB
  await db.connectDb();

  // 4) Use a regex query to find partial matches, case-insensitive
  const regex = new RegExp(searchTerm, "i");
  const results = await SubCategory3.find({ name: { $regex: regex } })
    .limit(10) // Adjust the limit as needed
    .lean();

  // 5) Disconnect from DB
  await db.disconnectDb();

  // 6) Return the results, optionally with caching headers
  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  });
}

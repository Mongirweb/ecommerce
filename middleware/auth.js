// middleware/auth.js

import { getToken } from "next-auth/jwt";

export default async function auth(req) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    // User is not authenticated
    // Throw an error or return a Response
    throw new Error("Not signed in");
  }

  // User is authenticated
  req.user = token.sub; // Attach the user ID to the request object

  // Return true to indicate successful authentication
  return true;
}

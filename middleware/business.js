import { getToken } from "next-auth/jwt";
import User from "../models/User";
import db from "../utils/db";
import { NextResponse } from "next/server";

export default async function business(req) {
  // Get token from the request
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Access denied, no token provided." }),
      { status: 401 }
    );
  }

  await db.connectDb();
  let user = await User.findById(token.sub);
  await db.disconnectDb();

  if (user?.role === "business") {
    // Continue to the next handler (in App Router, this is implicit)
    return NextResponse.next(); // Allow access to the resource
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Access denied, business resources only." }),
      { status: 401 }
    );
  }
}

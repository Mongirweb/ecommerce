import { getToken } from "next-auth/jwt";
import User from "../models/User";
import db from "../utils/db";
import { NextResponse } from "next/server";

export default async function admin(req) {
  // Extract token from the request
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

  // Check if the user has an admin role
  if (user?.role === "admin") {
    return NextResponse.next(); // Allow the request to proceed
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Access denied, Admin resources." }),
      { status: 401 }
    );
  }
}

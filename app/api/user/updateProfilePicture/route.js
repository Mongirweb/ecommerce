import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";
import User from "../../../../models/User";
import business from "../../../../middleware/business";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // Ensure database connection
    await db.connectDb();

    // Apply middleware
    await auth(req); // Check if the user is authenticated
    await business(req); // Check if the user has 'business' role

    // Parse request body once and reuse
    const body = await req.json();
    const { url } = body;

    let user = await User.findById(req.user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user profile picture
    await user.updateOne(
      {
        image: url,
      },
      {
        new: true,
      }
    );

    // Fetch updated user data
    user = await User.findById(req.user);

    await db.disconnectDb(); // Ensure database disconnection

    return NextResponse.json(
      { message: "User successfully changed profile picture" },
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb(); // Ensure database disconnection on error
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}

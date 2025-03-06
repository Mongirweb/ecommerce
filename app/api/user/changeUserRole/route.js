import { NextResponse } from "next/server";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth"; // Custom middleware

export async function POST(req) {
  try {
    // Authenticate the user using custom middleware
    await auth(req); // This will attach `req.user`

    if (!req.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json(); // Parse the request body

    const user = await User.findById(req.user);

    // Connect to the database
    await db.connectDb();

    // Check if the code is valid
    if (code === "somosdelhueco2025") {
      await User.findByIdAndUpdate(
        user, // Assuming `user` contains the user's ID
        { role: "business" },
        { new: true }
      );

      // Fetch the updated user data
      const updatedUser = await User.findById(user);

      // Disconnect from the database
      await db.disconnectDb();

      // Respond with the updated user info
      return NextResponse.json(
        {
          message: "User successfully converted to business",
          user: updatedUser,
        },
        { status: 200 }
      );
    } else {
      await db.disconnectDb();
      return NextResponse.json({ message: "codigo invalido" }, { status: 400 });
    }
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

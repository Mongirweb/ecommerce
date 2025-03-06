import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // or "bcrypt" if that's what you're using
import db from "../../../../utils/db";
import User from "../../../../models/User";
import { sendSuccessResetEmail } from "../../../../utils/sendSuccessResetEmail";
import sanitizeHtml from "sanitize-html";

// Helper to sanitize strings (removes all HTML tags)
function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export async function PUT(req) {
  try {
    // Connect to DB
    await db.connectDb();

    // 1) Destructure body from request
    const { user_id, password } = await req.json();

    // 2) Sanitize relevant fields
    //    user_id is typically an ObjectId. If your client sends it as a string, you can sanitize it:
    const safeUserId = sanitizeString(user_id);
    const safePassword = sanitizeString(password);

    // 3) Validate or convert safeUserId to ObjectId
    //    If user_id is supposed to be a valid MongoDB _id, you might do extra checks:
    //    e.g., if (!ObjectId.isValid(safeUserId)) { ... }

    // 4) Find user by ID
    const user = await User.findById(safeUserId);
    if (!user) {
      return NextResponse.json(
        { message: "Este correo no está registrado." },
        { status: 400 }
      );
    }

    // 5) Hash the new password
    const cryptedPassword = await bcrypt.hash(safePassword, 12);
    await user.updateOne({ password: cryptedPassword });

    // 6) Return success response
    //    Provide `email` so the client can sign in with NextAuth if needed
    const responseData = {
      email: user.email,
      message: "Contraseña recuperada con éxito.",
    };

    // Send success reset email
    sendSuccessResetEmail(user.email);

    await db.disconnectDb();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

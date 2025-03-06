import { NextResponse } from "next/server";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";
import sanitizeHtml from "sanitize-html";

// A helper to sanitize all string fields in your address object
function sanitizeAddressFields(addressObj) {
  const sanitized = { ...addressObj };
  for (let key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeHtml(sanitized[key], {
        // Example: remove all HTML tags
        allowedTags: [],
        allowedAttributes: {},
      });
    }
  }
  return sanitized;
}

export async function POST(req) {
  try {
    await db.connectDb();
    await auth(req);

    // Parse the request body
    const { address } = await req.json();

    // 1) Sanitize address fields
    const sanitizedAddress = sanitizeAddressFields(address);

    // 2) Find the user
    let user = await User.findById(req.user);
    if (!user) {
      await db.disconnectDb();
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // 3) Push the sanitized address
    await user.updateOne(
      {
        $push: {
          address: sanitizedAddress,
        },
      },
      {
        new: true,
      }
    );

    // 4) Refetch updated user
    user = await User.findById(req.user);

    await db.disconnectDb();

    // Return updated address array
    return NextResponse.json({ addresses: user.address }, { status: 200 });
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

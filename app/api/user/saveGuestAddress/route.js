import { NextResponse } from "next/server";
import User from "../../../../models/User";
import GuestCart from "../../../../models/GuestCart";
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

    // Parse the request body
    const { address, token } = await req.json();

    // 1) Sanitize address fields
    const sanitizedAddress = sanitizeAddressFields(address);

    // 2) Find the user
    let cart = await GuestCart.findOne({ token });
    if (!cart) {
      await db.disconnectDb();
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }
    if (cart.address.length) {
      return NextResponse.json(
        { message: "El invitado solo puede tener 1 dirección." },
        { status: 400 }
      );
    }

    // 3) Push the sanitized address
    await cart.updateOne(
      {
        email: address.email,
        $push: {
          address: sanitizedAddress,
        },
      },
      {
        new: true,
      }
    );

    // 4) Refetch updated user
    cart = await GuestCart.findOne({ token });

    await db.disconnectDb();

    // Return updated address array
    return NextResponse.json({ addresses: cart.address }, { status: 200 });
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

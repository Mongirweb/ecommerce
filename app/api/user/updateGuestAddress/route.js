import { NextResponse } from "next/server";
import GuestCart from "../../../../models/GuestCart";
import db from "../../../../utils/db";
import sanitizeHtml from "sanitize-html";

// A small helper to sanitize all string fields in your address object.
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

export async function PUT(req) {
  try {
    // 1) Connect DB & authenticate user
    await db.connectDb();

    // 2) Extract the address _id and the updated fields from JSON
    const { id, address, token } = await req.json(); // e.g. { id: "12345", address: { firstName: "...", ... } }

    // 2a) Sanitize any string fields in `address`
    const sanitizedAddress = sanitizeAddressFields(address);

    // 3) Fetch the logged-in user
    let cart = await GuestCart.findOne({ token: token });
    if (!cart) {
      await db.disconnectDb();
      return NextResponse.json({ message: "cart not found." }, { status: 404 });
    }

    // 4) Find the address in user.address array
    let cartAddresses = cart.address;
    let found = false;

    for (let i = 0; i < cartAddresses.length; i++) {
      // Compare as strings because _id is an ObjectId
      if (cartAddresses[i]._id.toString() === id) {
        // Merge existing address with updated (sanitized) fields
        cartAddresses[i] = {
          ...cartAddresses[i].toObject(),
          ...sanitizedAddress,
        };
        found = true;
        break;
      }
    }

    if (!found) {
      await db.disconnectDb();
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 }
      );
    }

    // 5) Update the user's address array in DB
    await cart.updateOne(
      {
        email: address.email,
        address: cartAddresses,
      },
      { new: true }
    );

    // 6) Refetch user for updated data
    cart = await GuestCart.findOne({ token: token });

    await db.disconnectDb();

    // 7) Return the updated addresses array
    return NextResponse.json({ addresses: cart.address }, { status: 200 });
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth";

export async function POST(req) {
  await db.connectDb();
  try {
    await auth(req); // This will attach `req.user`
    // Ensure the user is authenticated
    if (!req.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const {
      products,
      shippingAddress,
      paymentMethod,
      total,
      wholeSaleTotal,
      totalBeforeDiscount,
      shippingPrice,
      couponApplied,
    } = await req.json();

    // Find the user based on the authenticated user ID
    const user = await User.findById(req.user);

    // 1) Gather all distinct company IDs from products
    //    (assuming products[i].company is the ObjectId or string reference)
    const companies = [
      ...new Set(products.map((product) => product.company.toString())),
    ];

    // 2) Create the new order, including the companies array
    const newOrder = new Order({
      user: user._id,
      products,
      companies, // <-- Populate the companies field
      shippingAddress,
      shippingPrice,
      paymentMethod,
      total,
      wholeSaleTotal,
      totalBeforeDiscount,
      couponApplied,
    });

    await newOrder.save();

    await db.disconnectDb();

    // Return a JSON response with the order ID
    return NextResponse.json({
      order_id: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ message: "Error creating order" }), {
      status: 500,
    });
  } finally {
    await db.disconnectDb();
  }
}

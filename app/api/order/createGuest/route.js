import { NextResponse } from "next/server";
import GuestCart from "../../../../models/GuestCart";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

export async function POST(req) {
  await db.connectDb();
  try {
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
      token,
    } = await req.json();

    // 1) Gather all distinct company IDs from products
    //    (assuming products[i].company is the ObjectId or string reference)
    const companies = [
      ...new Set(products.map((product) => product.company.toString())),
    ];

    // 2) Create the new order, including the companies array
    const newOrder = new Order({
      guestToken: token,
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

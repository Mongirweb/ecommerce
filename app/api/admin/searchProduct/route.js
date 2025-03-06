import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/business";
import slugify from "slugify";

// Middleware function to handle authentication and business check
async function middleware(req) {
  await auth(req);
  await admin(req);
}

export async function GET(req) {
  try {
    await db.connectDb();
    await middleware(req);

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // Check if a product with the same name already exists
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    if (products.length === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 400,
      });
    }

    await db.disconnectDb();
    return new Response(
      JSON.stringify({
        message: "Products found",
        products, // or you can map/format products if needed
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

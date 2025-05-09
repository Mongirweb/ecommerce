import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import auth from "../../../../middleware/auth"; // Custom middleware

export async function POST(req) {
  try {
    // Connect to the database
    await db.connectDb();

    // // Authenticate the user and attach it to req
    // await auth(req); // This will attach `req.user`

    // // Ensure the user is authenticated
    // if (!req.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // Parse the request body
    const { products } = await req.json();

    // Process the products in the cart
    const checkQuantityProducts = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await Product.findById(product._id).lean();

        const subProduct = dbProduct.subProducts[product.style];
        let qty = 0;
        let part = product._uid.split("_");
        let size = part[2];

        qty = subProduct.sizes[size].qty;

        if (qty <= 0) {
          return {
            _id: dbProduct._id,
            name: dbProduct.name,
            product: dbProduct._id,
            subProduct: subProduct._id,
            size: product.size,
            qty: Number(qty),
          };
        }
        return null; // Explicitly return null for products with stock
      })
    ).then((products) => products.filter((product) => product !== null)); // Filter out null results

    // Disconnect from the database
    await db.disconnectDb();

    // Return success response
    return NextResponse.json(
      { products: checkQuantityProducts },
      { status: 200 }
    );
  } catch (error) {
    // Disconnect from the database in case of error
    await db.disconnectDb();

    // Return error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

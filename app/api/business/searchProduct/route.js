import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import auth from "../../../../middleware/auth";
import business from "../../../../middleware/business";
import Category from "../../../../models/Category";
import SubCategory from "../../../../models/SubCategory";
import SubCategory2 from "../../../../models/SubCategory2";
import SubCategory3 from "../../../../models/SubCategory3";
import mongoose from "mongoose";
import slugify from "slugify";

// Middleware function to handle authentication and business check
async function middleware(req) {
  await auth(req);
  await business(req);
}

export async function GET(req) {
  try {
    await db.connectDb();
    await middleware(req);

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");
    const companyId = searchParams.get("companyId");

    // Check if a product with the same name already exists
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      company: new mongoose.Types.ObjectId(companyId),
    })
      .populate({ path: "category", model: Category })
      .populate({ path: "subCategories", model: SubCategory })
      .populate({ path: "subCategorie2", model: SubCategory2 })
      .populate({ path: "subCategorie3", model: SubCategory3 })
      .lean();

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

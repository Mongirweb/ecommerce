import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import SubCategory from "../../../../models/SubCategory";
import SubCategory2 from "../../../../models/SubCategory2";
import SubCategory3 from "../../../../models/SubCategory3";
import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/business";

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
    const page = parseInt(searchParams.get("page")) || 1; // default page = 1
    const limit = 25; // items per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ company: query });

    // Check if a product with the same name already exists
    const products = await Product.find({
      company: query,
    })
      .populate({ path: "category", model: Category })
      .populate({ path: "subCategories", model: SubCategory })
      .populate({ path: "subCategorie2", model: SubCategory2 })
      .populate({ path: "subCategorie3", model: SubCategory3 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (products.length === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 400,
      });
    }
    // 3) Compute total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // 4) Return both the products and total pages
    const responseData = {
      products: products,
      totalPages,
    };

    await db.disconnectDb();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

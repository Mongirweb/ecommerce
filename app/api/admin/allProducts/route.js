// app/api/business/myProducts/route.js

import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import SubCategory from "../../../../models/SubCategory";
import SubCategory2 from "../../../../models/SubCategory2";
import SubCategory3 from "../../../../models/SubCategory3";

export async function GET(request) {
  await db.connectDb();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; // default page = 1
    const limit = 25; // items per page
    const skip = (page - 1) * limit;

    // 1) Count total documents for pagination
    const totalProducts = await Product.countDocuments();

    // 2) Fetch the products for the current page
    const myProducts = await Product.find({})
      .populate({ path: "category", model: Category })
      .populate({ path: "subCategories", model: SubCategory })
      .populate({ path: "subCategorie2", model: SubCategory2 })
      .populate({ path: "subCategorie3", model: SubCategory3 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 3) Compute total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // 4) Return both the products and total pages
    const responseData = {
      products: myProducts,
      totalPages,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching new products:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching new products" }),
      {
        status: 500,
      }
    );
  } finally {
    await db.disconnectDb();
  }
}

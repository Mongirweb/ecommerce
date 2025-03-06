// bringSimilar.js
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

export async function POST(req) {
  try {
    const { product, page } = await req.json();
    const limit = 6;
    const skip = page * limit;

    await db.connectDb();

    // Single "broad" query with OR
    const query = {
      category: product.category?._id,
      _id: { $ne: product._id },
      $or: [
        { subCategories: product.subCategories?.[0]?._id },
        { subCategorie2: product.subCategorie2?.[0]?._id },
        { subCategorie3: product.subCategorie3?.[0]?._id },
      ],
    };

    const similar = await Product.find(query)
      .select("name slug subProducts category images")
      .skip(skip)
      .limit(limit)
      .lean();

    await db.disconnectDb();

    return new Response(JSON.stringify(similar), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

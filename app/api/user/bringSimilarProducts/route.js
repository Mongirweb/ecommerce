// bringSimilar.js
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

export async function POST(req) {
  try {
    const { product, page } = await req.json();
    const limit = 6;
    const skip = page * limit;

    await db.connectDb();

    // Build the query object incrementally:
    // - Always match on the main category.
    // - Then, pick the "deepest" existing sub-category.
    const query = {
      category: product.category?._id,
      "subProducts.sizes.qty": { $gt: 0 },
    };

    if (product.subCategorie3?.[0]?._id) {
      // If we have subCategorie3
      query.subCategorie3 = product.subCategorie3[0]._id;
    } else if (product.subCategorie2?.[0]?._id) {
      // Else fallback to subCategorie2
      query.subCategorie2 = product.subCategorie2[0]._id;
    } else if (product.subCategories?.[0]?._id) {
      // Else fallback to subCategories
      query.subCategories = product.subCategories[0]._id;
    }

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

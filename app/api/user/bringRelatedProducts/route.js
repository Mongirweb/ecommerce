import Product from "../../../../models/Product";
import db from "../../../../utils/db";

export async function POST(req) {
  try {
    // Parse the request body
    const { product, page } = await req.json();
    const limit = 6;
    const skip = page * limit;

    // Connect to the database
    await db.connectDb();

    // Build the initial query
    let query = {
      category: product.category?._id || 0,
      subCategories: product.subCategories?.[0]?._id || 0,
      _id: { $ne: product._id }, // Exclude the current product
    };

    // Helper function to execute a query with skip/limit
    const runQuery = async (q) => {
      return Product.find(q)
        .select("name slug subProducts category images")
        .skip(skip)
        .limit(limit)
        .lean();
    };

    // Step 1: Try the narrowest query
    let related = await runQuery(query);

    // Step 2: If no results, broaden by removing subCategories
    if (related.length === 0) {
      delete query.subCategories;
      related = await runQuery(query);
    }

    // Step 3: If still no results, fallback to just category
    if (related.length === 0) {
      query = {
        category: product.category?._id || 0,
        _id: { $ne: product._id },
      };
      related = await runQuery(query);
    }

    // Disconnect from the database
    await db.disconnectDb();

    // Return the results
    return new Response(JSON.stringify(related), { status: 200 });
  } catch (error) {
    console.error(error);

    // Disconnect in case of error
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

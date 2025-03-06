import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export async function GET(req) {
  await db.connectDb();
  try {
    // Use an aggregation pipeline to:
    //  1) Match products whose subProducts have a discount > 0
    //  2) Create a new field "maxDiscount" for each product,
    //     storing the maximum discount among its subProducts
    //  3) Sort by "maxDiscount" descending to get the largest discount first
    //  4) (Optionally) also sort by createdAt descending if you want newest among ties
    //  5) Limit results to 6
    const page = req.nextUrl.searchParams.get("page") || 0;
    const limit = 6; // Adjust the limit if needed
    const skip = page * limit;
    const offersProducts = await Product.aggregate([
      {
        $match: {
          "subProducts.discount": { $gt: 0 },
        },
      },
      {
        $addFields: {
          maxDiscount: { $max: "$subProducts.discount" },
        },
      },
      // If you also want the newest among same discounts, do:
      // { $sort: { maxDiscount: -1, createdAt: -1 } },
      { $sort: { maxDiscount: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return new Response(JSON.stringify(offersProducts), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching products with discount:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching products with discount" }),
      {
        status: 500,
      }
    );
  } finally {
    await db.disconnectDb();
  }
}

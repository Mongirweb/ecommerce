import mongoose from "mongoose";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  await db.connectDb();
  try {
    const catId = new mongoose.Types.ObjectId("66b6840bc2bd5f4688ba3e9d");
    const sportId = new mongoose.Types.ObjectId("66b683e5c2bd5f4688ba3e83");
    const ferreteriaId = new mongoose.Types.ObjectId(
      "66b683fcc2bd5f4688ba3e93"
    );

    // helper: match a product that has *at least one* size with qty>0 and price in [0,150000]
    const sizeFilter = {
      "subProducts.sizes": {
        $elemMatch: {
          qty: { $gt: 0 },
          price: { $gte: 0, $lte: 150000 },
        },
      },
    };

    const [results] = await Product.aggregate([
      {
        $facet: {
          otherCategories: [
            {
              $match: {
                ...sizeFilter,
              },
            },
            { $sample: { size: 10 } },
          ],
        },
      },
      {
        $project: {
          products: {
            $concatArrays: ["$otherCategories"],
          },
        },
      },
    ]);

    return new Response(JSON.stringify(results.products), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  } finally {
    await db.disconnectDb();
  }
}

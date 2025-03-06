import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export async function GET(req) {
  await db.connectDb();
  try {
    const page = req.nextUrl.searchParams.get("page") || 0; // Default to 0 if not provided

    const limit = 15; // Adjust the limit if needed
    const skip = page * limit;

    const newProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return new Response(JSON.stringify(newProducts), {
      status: 200,
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

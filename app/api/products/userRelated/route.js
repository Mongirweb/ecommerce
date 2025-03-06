import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  await db.connectDb();
  try {
    // Return 10 random products in a single request
    const randomProducts = await Product.aggregate([
      { $match: { "subProducts.sizes.qty": { $gt: 0 } } },
      { $sample: { size: 10 } },
    ]);
    return new Response(JSON.stringify(randomProducts), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      {
        status: 500,
      }
    );
  } finally {
    await db.disconnectDb();
  }
}

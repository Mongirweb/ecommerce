import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export async function GET(req) {
  await db.connectDb();
  try {
    const electronicsCategoryID = "66b683eec2bd5f4688ba3e89"; // Replace with actual electronics category ID
    const total = await Product.countDocuments({
      category: electronicsCategoryID,
    });

    // If total products are less than or equal to the limit, return all products
    if (total <= 6) {
      const fashionProducts = await Product.find({
        category: electronicsCategoryID,
      }).lean();
      const response = new Response(JSON.stringify(fashionProducts), {
        status: 200,
      });
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }

    // Generate a random skip value, ensuring we leave enough room for 6 products
    const maxSkip = Math.max(0, total - 6);
    const randomSkip = Math.floor(Math.random() * maxSkip);

    const electronicProducts = await Product.find({
      category: electronicsCategoryID,
    })
      .skip(randomSkip)
      .limit(6)
      .lean();
    const response = new Response(JSON.stringify(electronicProducts), {
      status: 200,
    });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (error) {
    console.error("Error fetching electronic products:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching electronic products" }),
      {
        status: 500,
      }
    );
  } finally {
    await db.disconnectDb();
  }
}

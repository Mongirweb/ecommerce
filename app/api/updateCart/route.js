import Product from "../../../models/Product";
import db from "../../../utils/db";

export async function POST(req) {
  try {
    // Parse the request body
    const { products } = await req.json(); // Use req.json() to parse the body

    // Connect to the database
    await db.connectDb();

    // Iterate over the products in the request body
    const promises = products.map(async (p) => {
      let dbProduct = await Product.findById(p._id).lean();

      // Extract original price and quantity for the specified style and size
      let originalPrice = dbProduct.subProducts[p.style].sizes.find(
        (x) => x.size == p.size
      ).price;
      let quantity = dbProduct.subProducts[p.style].sizes.find(
        (x) => x.size == p.size
      ).qty;

      // Get the discount and shipping information
      let discount = dbProduct.subProducts[p.style].discount;
      let priceAfterDiscount =
        discount > 0
          ? originalPrice - (originalPrice * discount) / 100
          : originalPrice;

      return {
        ...p,
        priceBefore: originalPrice,
        price: priceAfterDiscount,
        discount: discount,
        quantity: quantity,
        shipping: dbProduct.shipping,
      };
    });

    // Resolve all product-related promises
    const data = await Promise.all(promises);

    // Disconnect from the database
    await db.disconnectDb();

    // Return the product data in the response
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    // Handle errors with a 500 status code and detailed error message
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
